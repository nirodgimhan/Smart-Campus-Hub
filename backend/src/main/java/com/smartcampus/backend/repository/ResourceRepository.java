package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface ResourceRepository extends MongoRepository<Resource, String> {
    List<Resource> findByTypeAndStatus(String type, Resource.ResourceStatus status);

    List<Resource> findByLocationContainingIgnoreCase(String location);

    @Query("{ 'status': 'ACTIVE', 'capacity': { $gte: ?0 } }")
    List<Resource> findActiveWithMinCapacity(Integer minCapacity);
}