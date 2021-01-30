# Instructions
### Go to the project's directory and install dependencies
```
npm install
```
### Start the server in dev mode
```
npm run dev
```


# timeflex - Calendar/Planner for Academia
### Motivation
Existing calendar/planner apps are very good for handling tasks that will occupy
a fixed time-slot, such as a 2-hour lecture. For people working in academia (and
potentially in other professions as well), there are tasks that cannot be
associated with a fixed time-slot when they are given. For example, a professor
may need to assign around 10 hours to grade the final exam of a large class
within the two weeks after the exam but it is somewhat flexible which 10 hours
are used for this purpose; she/he may also agree to serve on the programme
committee of some conference and therefore need to put in about 20 hours of
effort to review the papers for the conference in early to mid-July but again it is
somewhat flexible which 20 hours are used for this task. It is easy to lose track
on the number of "flexible" tasks one has committed to, resulting in poor time
management.

### Objectives
This project aims to provide a tailor-made solution for academia, allowing them
to allocate timeslot for tasks that take dynamic time length to complete.
TimeFlex, a web / mobile app will be developed in this project and it will provide
the following features:
1) Features that the existing usual planner apps can provide e.g. create
events, display the events in the app’s calendar and event notifications;
2) More than a usual planner, TimeFlex provides an intelligent planning
feature that allows users to create events that do not have a designated
timeslot, users only need to provide the duration of the event and the
intelligent planner of TimeFlex will automatically allocate a timeslot for that
tasks according to the user’s preference
3) TimeFlex allows academia to add their events as “class” or “consultation
hours”, then the event will be automatically set as a task that has to be
handled at least once every week (e.g. a course has a total of 3-hour
lectures taught in two different days in a week)

### Methodologies
TimeFlex Planner will be available on web and mobile platforms. Below are the
corresponding tools / technologies that will be applied during the development
of TimeFlex’s web app and native mobile app:

#### 1. Front-end Web Development with React
The front-end of TimeFlex’s responsive web app is going to be built with
React, an open-source library written in JavaScript for building user
interfaces and also UI components. React can be used for developing
single-page or mobile applications. The use of additional libraries for state
management and routing, such as Redux and React Router are also
possible depending on the actual situation during the development process.

#### 2. Native Mobile App Development with React Native
Besides web version, TimeFlex will also be available on the iOS and
Android platform and the native mobile app will be developed using React
Native, which is a mobile app framework that has only slight differences
with React. During the development process, it is expected that many
components and code can be reused, and hence the time required and
complexity of this project can be greatly reduced, as the product on
different platforms indeed share the same code base.

#### 3. Backend Development with Express (NodeJS)
As for the backend, both the web and mobile version of TimeFlex will make
use of the Express framework. It is a minimal and flexible Node.js backend
web application framework that is designed for building web and mobile
applications. Express is easy to setup and to use, it also has large number
of plugins available.
The back-end of TimeFlex will also be responsible for the intelligent
planning feature. Users can create an event with a flexible timeslot, an
algorithm which is implemented on the back-end will then allocate events
with flexible timeslot to the calendar.
