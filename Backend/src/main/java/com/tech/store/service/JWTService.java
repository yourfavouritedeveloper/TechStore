package com.tech.store.service;

import com.tech.store.dao.entity.AccountEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JWTService {

    /*This is a JWT Documentary written by Nihad Mammadov.
    Will be used for the future projects
     */


    /*
    WHATS THE POINT OF USING SECRET KEY:
    it is a randomly generated string (which is being generated ONCE ONLY) to verify and and sign jwt tokens
     */
    @Value("${jwt.secret}")
    private String secretKey;

    /*
    good practice to put expiration time for 1 hour (personal preference and experience)
     */
    private static final long EXPIRATION_TIME = 1000 * 60 * 60;



    public String generateToken(String username) {

        Map<String,Object> claims = new HashMap<>();


        /*
        The method where tokens are generated.
        Realize that USERNAME is being used here as subject, it can vary to other unique elements, like id for example.
        it is signed with getKey method
         */
        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getKey())
                .compact();

    }

    /*
    this is where our secret key is turned into a real key
    it is being seperated into byte keys
     */
    private SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }



    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /*
    claim means DATA
    here, we can extract our datas from token
     */
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {

        return extractClaim(token, Claims::getExpiration);
    }
}
