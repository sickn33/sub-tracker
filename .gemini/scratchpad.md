# Project Scratchpad - Sub Tracker

## Background and Motivation

The user is experiencing a `SecurityError: Failed to execute 'requestPermission' on 'FileSystemHandle': User activation is required to request permissions.` when auto-save attempts to run. This is because browser security policies require a user gesture (like a click) to trigger permission requests for the File System Access API.

## Project Status Board

- ID: T01
  Goal: Research and reproduce the auto-save security error
  Success Criteria: Understand why `requestPermission` is called during auto-save and how to fix it.
  Test Case: N/A (Research task)
  Status: todo

- ID: T02
  Goal: Implement a fix for user-activated permission requests
  Success Criteria: `requestPermission` is only called after a user gesture, and auto-save works once permission is granted.
  Test Case: Trigger auto-save and verify it doesn't fail with SecurityError if permission is already granted or requested via user gesture.
  Status: todo

## Current Status

- Initializing project context.
- Identified `src/hooks/useLocalBackup.ts` as the likely source of the issue.

## Lessons

- Browser File System Access API requires user activation for `requestPermission`.

## Executor's Feedback

- None yet.
