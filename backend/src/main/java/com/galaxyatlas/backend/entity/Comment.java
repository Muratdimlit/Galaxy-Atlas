package com.galaxyatlas.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long spaceObjectId;

    @Column(length = 1000)
    private String content;

    @Transient
    private String userName;

    public Comment() {
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getSpaceObjectId() {
        return spaceObjectId;
    }

    public String getContent() {
        return content;
    }

    public String getUserName() {
        return userName;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setSpaceObjectId(Long spaceObjectId) {
        this.spaceObjectId = spaceObjectId;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}