const data  = { sql: `

TRUNCATE TABLE "Broadcasts", "Users", "Sponsors", "Studies", "RightsProfiles", "AuditLogs" cascade;

insert into "Users" ("id", "firstName", "lastName", "email", "title", "phone", "institution", "address", "zipCode", "city", "state", "country", "password",
"forcePasswordChange", "passwordCreationDate", "userName", "active", "profiles", "roles", "updatedAt", "createdAt") values (
  'efff2881-6979-49b0-964d-181100167efe', --id
  'Test', --firstname
  'User1', --lastname
  'boristotle@hotmail.com', --email
  'dtb', --title
  '309-555-5555', --phone
  'NAInstitute', --institution
  'Hollywood & Vine', --address
  '32953', --zipcode
  'Merritt Island', --city
  null, --state
  null, --country
  '$2a$14$9Vf9yZO3OW8/tP/NMoxnu.LngAyyHZnhv2FqUvBStKTjyev82z5y6', --password
   false, --forcePasswordChange
   '09-09-2017', --passwordCreationDate
   'testUser1', --username
   true, --active
   '{1}',--profiles
   '{"any": ["any"]}',--roles
   CURRENT_TIMESTAMP, --createdAt
   CURRENT_TIMESTAMP --updatedAt
);

insert into "Broadcasts" ("id", "message", "UserId", "createdAt", "updatedAt") values (
  1,
  'this is a broadcast',
  (select id from "Users" u where u."userName" = 'testUser1'), --UserId association to testUser1
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);


insert into "Sponsors" ("id", "name", "displayName", "createdAt", "updatedAt") values (9999,'pfizer','Pfizer',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);


insert into "Studies" ("id", "code", "status", "comments", "primaryLeader", "secondaryLeaders", "startDate", "endDate", "devices",
 "createdAt", "updatedAt", "SponsorId") values (
  1,
 'study-001',
  'requested',
  '[]',
  'efff2881-6979-49b0-964d-181100167efe', -- primaryLeader
  default, --secondaryLeaders
  '10-22-2016',
  '10-22-2018',
  -- devices
  '[
      {"name":"D5100",
      "sensitivity":"200",
      "focalLength":"100",
      "aperture":"2",
      "shutterSpeed":"200",
      "focusMode":"manual",
      "flash":"on"}
    ]',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP,
  (select id from "Sponsors" s where s.name = 'pfizer') --SponsorId association to pfizer
);

insert into "RightsProfiles" ("id", "name", "permissions", "StudyId", "createdAt", "updatedAt", "systemAdmin") values (
    1,
    'Admin',
    '{
      "auditLogs": {
        "getAllLogs": true
      },
      "broadcasts": {
        "getAllBroadcasts": true,
        "createBroadcast": true
      },
      "devices": {
        "addHistoryDevices": true,
        "getHistoryDevices": true,
        "getAllDevices": true,
        "getOneDevice": true,
        "createDevice": true,
        "updateDevice": true
      },
      "files": {
        "getOneFile": true
      },
      "images": {
        "deleteImage": true,
        "uploadImage": true,
        "associateImage": true,
        "unattachedImagesForUser": true,
        "unattachedImagesForSubject": true,
        "maskImage": true,
        "getMaskImage": true,
        "webImage": true,
        "thumbImage": true,
        "fullImage": true,
        "originalImage": true
      },
      "index": {
        "getDocs": true,
        "serveApp": true,
        "getForcePasswordChange": true,
        "createUser": true,
        "postForcePasswordChange": true
      },
      "inquiries": {
        "uploadFileInquiries": true,
        "getAllInquiries": true,
        "getAllInquiriesForVisit": true,
        "getOneInquiry": true,
        "createInquiry": true,
        "commentInquiry": true,
        "closeInquiry": true
      },
      "profiles": {
        "deleteProfile": true,
        "createProfile": true,
        "updateProfile": true,
        "getOneProfile": true,
        "getAllProfiles": true,
        "getAllProfilesForStudy": true
      },
      "sites": {
        "getAllSites": true
      },
      "sponsors": {
        "getAllSponsors": true,
        "createSponsor": true,
        "getOneSponsor": true
      },
      "studies": {
        "getCreatedStudies": true,
        "getAllStudies": true
      },
      "studyConfig": {
        "uploadThumbnailStudyConfig": true,
        "requestStudyConfig": true,
        "updatedRequestStudyConfig": true,
        "approveStudyConfig": true,
        "rejectStudyConfig": true,
        "closeStudyConfig": true,
        "getOneStudyConfig": true,
        "modifyStudyConfig": true
      },
      "subjects": {
        "getAllSubjectsForSite": true,
        "createSubject": true,
        "subjectGrid": true
      },
      "users": {
        "getAllUsers": true,
        "bulkCreateUsers": true,
        "createUser": true,
        "adminCreateUser": true,
        "adminResetPasswordUser": true,
        "updateUser": true,
        "getProfilesForUser": true,
        "attachUserToProfile": true,
        "getUserRoles": true,
        "getStudiesForUserRoles": true,
        "attachUserToAdminProfile": true,
        "removeUserFromAdminProfile": true
      },
      "visits": {
        "reviewVisit": true,
        "getAllVisitsForStudy": true
      }
    }',
    null,
    '03-07-2017',
    '03-07-2017',
    true
  );
`
}

module.exports = data;