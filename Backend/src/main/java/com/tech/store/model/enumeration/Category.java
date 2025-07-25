package com.tech.store.model.enumeration;

import lombok.Getter;

@Getter
public enum Category {
    COMPUTER("computer"),
    MONITOR("monitor"),
    HEADPHONE("headphone"),
    KEYBOARD("keyboard"),
    MOBILE_PHONE("mobile phone"),
    TV("tv"),
    SMART_WATCH("smart watch"),
    TABLET("tablet");

    private final String name;

    Category(String name) {
        this.name = name.toLowerCase();
    }

}
