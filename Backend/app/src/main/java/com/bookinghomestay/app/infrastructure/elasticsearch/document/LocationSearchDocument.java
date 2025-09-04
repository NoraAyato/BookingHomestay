package com.bookinghomestay.app.infrastructure.elasticsearch.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.*;
import org.springframework.data.elasticsearch.core.suggest.Completion;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(indexName = "location")
public class LocationSearchDocument {

    @Id
    private String id;

    @Field(type = FieldType.Text)
    private String tenKv;

    @CompletionField
    private Completion suggest;
}
