    package com.bookinghomestay.app.infrastructure.elasticsearch.mapper;

    import com.bookinghomestay.app.domain.model.Homestay;
    import com.bookinghomestay.app.infrastructure.elasticsearch.document.HomestaySearchDocument;

    import org.springframework.stereotype.Component;
    import org.springframework.data.elasticsearch.core.suggest.Completion;

    import java.util.List;

    @Component
    public class HomestaySearchMapper {

        public HomestaySearchDocument toDocument(Homestay h) {
            String tenKv = h.getKhuVuc() != null ? h.getKhuVuc().getTenKv() : "";
            return HomestaySearchDocument.builder()
                    .id(h.getIdHomestay())
                    .tenHomestay(h.getTenHomestay())
                    .diaChi(h.getDiaChi())
                    .khuVuc(tenKv)
                    .suggest(new Completion(List.of(h.getTenHomestay(), tenKv)))
                    .build();
        }
    }
