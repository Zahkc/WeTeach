use weteach_live

db.records.insertMany([{
  "type": "USER",
  "name": "Peter",
  "description": "Presenter Account 1",
  "createdBy": 0,
  "createdDateTime": "2023-05-09T00:00:00Z",
  "lastModifiedBy": 0,
  "lastModifiedDateTime": {
    "$date": "2023-05-09T12:23:25.584Z"
  },
  "purged": 0,
  "locked": 0,
  "wmid": 1001,
  "mask": 0,
  "password": "$2a$10$Kd2rXYX.D5d1VEtyJ/UgcO0selFquUI1B5iKLDngLtS2IOdf6Y5Fu",
  "username": "peter"
},{
  "type": "USER",
  "name": "Paul",
  "description": "Presenter Account 2",
  "createdBy": 0,
  "createdDateTime": "2023-05-09T00:00:00Z",
  "lastModifiedBy": 0,
  "lastModifiedDateTime": {
    "$date": "2023-05-09T12:24:59.317Z"
  },
  "purged": 0,
  "locked": 0,
  "wmid": 1002,
  "mask": 0,
  "password": "$2a$10$4tIIwD3XYuX/oNBLYtbSQ.s1mVFZ51Ciz8.yqi0yfHKCbRgdIiDfC",
  "username": "paul"
},{
  "type": "USER",
  "name": "Alice",
  "description": "Attendee Account 1",
  "createdBy": 0,
  "createdDateTime": "2023-05-09T00:00:00Z",
  "lastModifiedBy": 0,
  "lastModifiedDateTime": {
    "$date": "2023-05-09T12:25:32.021Z"
  },
  "purged": 0,
  "locked": 0,
  "wmid": 2001,
  "mask": 2,
  "password": "$2a$10$aDBbS9M.MGWValQ3Ypm4I.8nZcxVQCK1pAtaOkYC3VMeRcrLO3ME.",
  "username": "alice"
},{
  "type": "USER",
  "name": "Ash",
  "description": "Attendee Account 2",
  "createdBy": 0,
  "createdDateTime": "2023-05-09T00:00:00Z",
  "lastModifiedBy": 0,
  "lastModifiedDateTime": {
    "$date": "2023-05-09T12:25:50.787Z"
  },
  "purged": 0,
  "locked": 0,
  "wmid": 2002,
  "mask": 2,
  "password": "$2a$10$3OztKaHDU5mkI.h9o8sA8etwZ/aoUPfOYHcteyS87AtAQyftuctIS",
  "username": "ash"
}]);