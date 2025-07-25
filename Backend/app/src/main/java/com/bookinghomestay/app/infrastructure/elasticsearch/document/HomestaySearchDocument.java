package com.bookinghomestay.app.infrastructure.elasticsearch.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.*;
import org.springframework.data.elasticsearch.core.suggest.Completion;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(indexName = "homestay")
public class HomestaySearchDocument {

    @Id
    private String id;

    @Field(type = FieldType.Text)
    private String tenHomestay;

    @Field(type = FieldType.Text)
    private String diaChi;

    @Field(type = FieldType.Text)
    private String khuVuc;

    @CompletionField
    private Completion suggest;
}
