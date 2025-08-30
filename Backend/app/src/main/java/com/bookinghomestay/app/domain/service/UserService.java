package com.bookinghomestay.app.domain.service;

import java.text.Normalizer;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    public static String removeDiacritics(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
    }
}
