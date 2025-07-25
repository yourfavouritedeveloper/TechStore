package com.tech.store.model.enumeration;

import java.math.BigDecimal;
import java.math.RoundingMode;

public enum Currency {

    AZN(BigDecimal.valueOf(1.0), "AZN"),
    USD(BigDecimal.valueOf(1.7), "USD"),
    EUR(BigDecimal.valueOf(1.95), "EUR"),
    TRY(BigDecimal.valueOf(0.043), "TRY"),
    RUB(BigDecimal.valueOf(0.022), "RUB");

    private final BigDecimal rateToAZN;
    private final String symbol;

    Currency(BigDecimal rateToAZN, String symbol) {
        this.rateToAZN = rateToAZN;
        this.symbol = symbol;
    }

    public BigDecimal getRateToAZN() {
        return rateToAZN;
    }

    public String getSymbol() {
        return symbol;
    }


    public static BigDecimal convert(BigDecimal amount, Currency from, Currency to) {
        if (from == to) {
            return amount;
        }
        BigDecimal amountInAZN = amount.multiply(from.getRateToAZN());

        BigDecimal convertedAmount = amountInAZN.divide(to.getRateToAZN(), 4, RoundingMode.HALF_UP);

        return convertedAmount;
    }

}
