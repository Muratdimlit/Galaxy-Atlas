package com.galaxyatlas.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long spaceObjectId;

    private String username;

    private String content;

    public Long getId() {
        return id;
    }

    public Long getSpaceObjectId() {
        return spaceObjectId;
    }

    public String getUsername() {
        return username;
    }

    public String getContent() {
        return content;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setSpaceObjectId(Long spaceObjectId) {
        this.spaceObjectId = spaceObjectId;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setContent(String content) {
        this.content = content;
    }
}