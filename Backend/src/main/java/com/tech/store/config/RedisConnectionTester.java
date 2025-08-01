package com.tech.store.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.stereotype.Component;

@Component
public class RedisConnectionTester implements CommandLineRunner {

    private final JedisConnectionFactory jedisConnectionFactory;

    public RedisConnectionTester(JedisConnectionFactory jedisConnectionFactory) {
        this.jedisConnectionFactory = jedisConnectionFactory;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            var connection = jedisConnectionFactory.getConnection();
            connection.ping();
            System.out.println("[RedisConnectionTester] Redis PING successful");
        } catch (Exception e) {
            System.err.println("[RedisConnectionTester] Redis connection failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
}