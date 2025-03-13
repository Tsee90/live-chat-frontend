Frontend for final The Odin Project assignment
Coded by Theo See

The objective of this final assignment is to create a website similar to a current social media site.

See it in action at https://chizmiz.live

To see api documentation see https://github.com/Tsee90/live-chat-api

This project uses React, CSS, Axios, and Socket.io.

This app allows users to create and join live chat rooms anonymously. Chat rooms can be sorted by distance, popularity, and time created. It is inspired by similar chat apps such as Yik Yak and Nearby.

React is used to create a dynamic single page website. The page files can be found under 'pages' folder and the components in the 'components' folder respectively. I also used a AuthContext to provide top level state variables found in 'context' folder.

Axios is used for http route calls. It is initialized in api.js. Used mainly for creating users and login.

Socket.io is used to facilitate live communication. Coupled with React it creates a smooth user interface that updates instantly and automatically.
