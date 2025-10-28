package com.tech.store.service;

import com.tech.store.dao.entity.AccountEntity;
import com.tech.store.dao.entity.RefreshToken;
import com.tech.store.dao.repository.AccountRepository;
import com.tech.store.dao.repository.RefreshTokenRepository;
import com.tech.store.exception.AccountNotFoundException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.sql.Ref;
import java.time.Instant;
import java.util.*;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
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

    private final RefreshTokenRepository refreshTokenRepository;
    private final AccountRepository accountRepository;

    /*
    good practice to put expiration time for 1 day (personal preference and experience)
     */
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    /*
    Expiration time for refresh time, MUST BE LONGER THAN NORMAL JWT
     */

    private static final long EXPIRATION_TIME_REFRESH = 1000 * 60 * 60 * 24 * 7;



    public String generateToken(String username) {

        Map<String,Object> claims = new HashMap<>();
        claims.put("type", "access");


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

    public RefreshToken generateRefreshToken(String username) {


        /*
        The method where REFRESH TOKENS are generated.
        Refresh token : a long-lived version of jwt tokens.
         */

        AccountEntity accountEntity = accountRepository.findByUsername(username)
                .orElseThrow(() -> new AccountNotFoundException("Account not found"));

        RefreshToken refreshToken = RefreshToken.builder()
                .account(accountEntity)
                .token(UUID.randomUUID().toString())
                .expiresAt(Instant.now().plusMillis(EXPIRATION_TIME_REFRESH))
                .build();

        return refreshTokenRepository.save(refreshToken);


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




    public boolean isRefreshToken(String token) {
        return "refresh".equals(extractAllClaims(token).get("type", String.class));
    }

    public boolean isAccessToken(String token) {
        return "access".equals(extractAllClaims(token).get("type", String.class));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {

        return extractClaim(token, Claims::getExpiration);
    }
}
