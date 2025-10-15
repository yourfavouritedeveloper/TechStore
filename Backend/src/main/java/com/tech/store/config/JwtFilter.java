package com.tech.store.config;

import com.tech.store.service.AccountDetailsService;
import com.tech.store.service.JWTService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
/*
The purpose: verify jwt tokens before any request reaches to controller
 */

/*
The best description for JWT
JWT - a digital ID card
Controller - rooms
JwtFilter - the security guard

it will scan the JWT token first
will verify whether or not it is valid or expired
will set authentication to use controller
 */
public class JwtFilter extends OncePerRequestFilter {

    private final JWTService jwtService;
    private final AccountDetailsService accountDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        /*
        The client (Front-end) will send a header in "Bearer <token>" format
         */
        String header = request.getHeader("Authorization");
        String token = null;
        String username = null;
        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);
            username = jwtService.extractUsername(token);
        }

        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            /*
            calls the user from db
             */
            UserDetails userDetails = accountDetailsService.loadUserByUsername(username);

            /*
            validation of token happens here
             */
            if(jwtService.validateToken(token,userDetails)) {
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            }
        }

        /*
        moves on to the next filter
         */
        filterChain.doFilter(request, response);
    }
}
