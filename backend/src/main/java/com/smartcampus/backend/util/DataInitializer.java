package com.smartcampus.backend.util;

import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.Collections;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ResourceRepository resourceRepository;

    @Override
    public void run(String... args) throws Exception {
        if (resourceRepository.count() == 0) {
            // Create sample lecture hall
            Resource hall = new Resource();
            hall.setName("Main Lecture Hall");
            hall.setType("LECTURE_HALL");
            hall.setCapacity(200);
            hall.setLocation("Building A, Floor 2");
            hall.setStatus(Resource.ResourceStatus.ACTIVE);
            hall.setAvailabilityWindows(Collections.emptyList()); // Add availability windows if needed
            resourceRepository.save(hall);

            // Create sample computer lab
            Resource lab = new Resource();
            lab.setName("Computer Lab 101");
            lab.setType("LAB");
            lab.setCapacity(30);
            lab.setLocation("Building B, Floor 1");
            lab.setStatus(Resource.ResourceStatus.ACTIVE);
            lab.setAvailabilityWindows(Collections.emptyList());
            resourceRepository.save(lab);

            // Create sample meeting room
            Resource meetingRoom = new Resource();
            meetingRoom.setName("Conference Room A");
            meetingRoom.setType("MEETING_ROOM");
            meetingRoom.setCapacity(10);
            meetingRoom.setLocation("Building C, Floor 3");
            meetingRoom.setStatus(Resource.ResourceStatus.ACTIVE);
            meetingRoom.setAvailabilityWindows(Collections.emptyList());
            resourceRepository.save(meetingRoom);

            // Create sample equipment (projector)
            Resource projector = new Resource();
            projector.setName("Portable Projector");
            projector.setType("EQUIPMENT");
            projector.setCapacity(1);
            projector.setLocation("AV Store Room");
            projector.setStatus(Resource.ResourceStatus.ACTIVE);
            projector.setAvailabilityWindows(Collections.emptyList());
            resourceRepository.save(projector);

            System.out.println("Sample resources created successfully.");
        } else {
            System.out.println("Resources already exist. Skipping initialization.");
        }
    }
}