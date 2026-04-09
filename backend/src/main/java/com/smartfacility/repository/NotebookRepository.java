package com.smartfacility.repository;

import com.smartfacility.model.Notebook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotebookRepository extends JpaRepository<Notebook, Long> {
    List<Notebook> findByOwnerEmailOrderByUpdatedAtDesc(String ownerEmail);
}
