package com.bookinghomestay.app.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String avatarPath = "file:" + System.getProperty("user.dir") + "/uploads/avatars/";
        registry.addResourceHandler("/avatars/**")
                .addResourceLocations(avatarPath)
                .setCachePeriod(0); // không cache để debug
        System.out.println("Serving avatars from: " + avatarPath);
    }
}
