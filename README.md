
# TimeFlex - Calendar/Planner for Academia
### Instructions
#### Go to the project's directory and install dependencies
```
npm run app-install
```
#### host the web app server locally
1)  In /client/src/config.js, set the module.exports to LOCAL_HOST_CONFIG
2)  Do the same for /config.js
3)  Add the keys.js file to /server/config
4)  Run the following command:
```
npm run client-build    //required for first run only
npm run start
```

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
- Features that the existing usual planner apps can provide e.g. create
events, display the events in the app’s calendar and event notifications;
- More than a usual planner, TimeFlex provides an intelligent planning
feature that allows users to create events that do not have a designated
timeslot, users only need to provide the duration of the event and the
intelligent planner of TimeFlex will automatically allocate a timeslot for that
tasks according to the user’s preference.
