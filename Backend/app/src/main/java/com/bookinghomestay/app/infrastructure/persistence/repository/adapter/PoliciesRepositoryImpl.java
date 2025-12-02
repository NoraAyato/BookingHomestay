package com.bookinghomestay.app.infrastructure.persistence.repository.adapter;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.ChinhSach;
import com.bookinghomestay.app.domain.repository.IPoliciesRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaPoliciesRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PoliciesRepositoryImpl implements IPoliciesRepository {
    private final JpaPoliciesRepository jpaPoliciesRepository;

    @Override
    public void save(ChinhSach policy) {
        jpaPoliciesRepository.save(policy);
    }

}
