package com.bookinghomestay.app.infrastructure.persistence.repository.mongodb;

import com.bookinghomestay.app.infrastructure.persistence.document.HomestayDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * MongoDB repository for Homestay documents
 */
@Repository
public interface MongoHomestayRepository extends MongoRepository<HomestayDocument, String> {

    /**
     * Find homestays by location
     */
    @Query("{'khuVuc.tenKhuVuc': {$regex: ?0, $options: 'i'}}")
    List<HomestayDocument> findByLocationContaining(String location);

    /**
     * Find homestays by price range
     */
    @Query("{'giaTu': {$lte: ?1}, 'giaDen': {$gte: ?0}}")
    List<HomestayDocument> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);

    /**
     * Find homestays by amenities
     */
    @Query("{'amenities': {$in: ?0}}")
    List<HomestayDocument> findByAmenitiesIn(List<String> amenities);

    /**
     * Find homestays by rating
     */
    @Query("{'rating.averageRating': {$gte: ?0}}")
    List<HomestayDocument> findByRatingGreaterThanEqual(Double minRating);

    /**
     * Find available homestays (active status)
     */
    @Query("{'trangThai': 'Active'}")
    List<HomestayDocument> findActiveHomestays();

    /**
     * Full text search
     */
    @Query("{ $or: [ " +
            "{'tenHomestay': {$regex: ?0, $options: 'i'}}, " +
            "{'moTa': {$regex: ?0, $options: 'i'}}, " +
            "{'diaChi': {$regex: ?0, $options: 'i'}}, " +
            "{'khuVuc.tenKhuVuc': {$regex: ?0, $options: 'i'}} " +
            "]}")
    List<HomestayDocument> searchByText(String searchText);

    /**
     * Find homestays for AI recommendations
     */
    @Query("{ $and: [ " +
            "{'trangThai': 'Active'}, " +
            "{'rating.averageRating': {$gte: 3.0}}, " +
            "{'rooms': {$exists: true, $ne: []}} " +
            "]}")
    List<HomestayDocument> findForAiRecommendations();

    /**
     * Find homestays by host
     */
    List<HomestayDocument> findByUserId(String hostId);

    /**
     * Count homestays by location
     */
    @Query(value = "{'khuVuc.tenKhuVuc': {$regex: ?0, $options: 'i'}}", count = true)
    long countByLocationContaining(String location);
}