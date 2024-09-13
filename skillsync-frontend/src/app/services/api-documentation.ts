/**
 * @fileoverview This file contains the documentation for the SkillSync API.
 * It provides an overview of all available endpoints and their usage.
 */

/**
 * @namespace SkillSyncAPI
 * @description The SkillSync API provides endpoints for managing courses, user profiles, and analytics.
 */

/**
 * @memberof SkillSyncAPI
 * @name Analytics
 * @description Endpoints related to analytics data.
 */

/**
 * @function getAnalytics
 * @memberof SkillSyncAPI.Analytics
 * @description Retrieves analytics data from the server.
 * @returns {Observable<any>} An Observable of analytics data.
 * @throws {Error} If the request fails.
 */

/**
 * @memberof SkillSyncAPI
 * @name Assessments
 * @description Endpoints related to assessments.
 */

/**
 * @function createAssessment
 * @memberof SkillSyncAPI.Assessments
 * @description Creates a new assessment.
 * @param {Object} data - The assessment data to be created.
 * @returns {Observable<any>} An Observable of the created assessment.
 * @throws {Error} If the request fails.
 */

/**
 * @function getAssessment
 * @memberof SkillSyncAPI.Assessments
 * @description Retrieves an assessment by its ID.
 * @param {string} id - The ID of the assessment to retrieve.
 * @returns {Observable<any>} An Observable of the requested assessment.
 * @throws {Error} If the request fails.
 */

/**
 * @memberof SkillSyncAPI
 * @name Courses
 * @description Endpoints related to courses.
 */

/**
 * @function getCourses
 * @memberof SkillSyncAPI.Courses
 * @description Retrieves all courses, using caching for improved performance.
 * @returns {Observable<Course[]>} An Observable of an array of Course objects.
 * @throws {Error} If the request fails and there's no cached data.
 */

/**
 * @function getCourseDetails
 * @memberof SkillSyncAPI.Courses
 * @description Retrieves details for a specific course, using caching for improved performance.
 * @param {string} courseId - The ID of the course to retrieve.
 * @returns {Observable<any>} An Observable of the course details.
 * @throws {Error} If the request fails and there's no cached data.
 */

// ... Continue documenting all other methods in the ApiService ...

/**
 * @memberof SkillSyncAPI
 * @name UserProfile
 * @description Endpoints related to user profiles.
 */

/**
 * @function getUserProfile
 * @memberof SkillSyncAPI.UserProfile
 * @description Retrieves the user's profile.
 * @returns {Observable<User>} An Observable of the User object.
 * @throws {Error} If the request fails.
 */

/**
 * @function updateUserProfile
 * @memberof SkillSyncAPI.UserProfile
 * @description Updates the user's profile.
 * @param {Object} profileData - The profile data to update.
 * @returns {Observable<any>} An Observable of the update result.
 * @throws {Error} If the request fails.
 */

/**
 * @function uploadProfilePicture
 * @memberof SkillSyncAPI.UserProfile
 * @description Uploads a new profile picture for the user.
 * @param {File} file - The image file to upload.
 * @returns {Observable<any>} An Observable of the upload result.
 * @throws {Error} If the request fails.
 */

/**
 * @function deleteProfilePicture
 * @memberof SkillSyncAPI.UserProfile
 * @description Deletes the user's current profile picture.
 * @returns {Observable<any>} An Observable of the deletion result.
 * @throws {Error} If the request fails.
 */