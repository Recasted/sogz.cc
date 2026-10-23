/*
  comments-config.js — where player comments are sent for approval.

  Player comments go to a Google Form that only you can see. Nothing
  shows up on the site until you approve it (see README.md, section
  "Player comments", for the step-by-step setup and how to approve).

  Paste your Google Form's PRE-FILLED link between the quotes below.
  Make the pre-filled link with these exact answers:
    question 1: THREAD
    question 2: NAME
    question 3: AVATAR
    question 4: TEXT
  The site reads the link to find out which box is which.

  While this is empty, comments only stay on the player's own computer.
*/
window.COMMENTS_CONFIG = {
  googleFormPrefilledLink: "",

  maxLength: 500,          // longest comment allowed, in characters
  secondsBetweenPosts: 30  // stops people spamming many comments quickly
};

/*
  The standard avatars players can pick from. The files are in
  shared/avatars/. To add one, put a new .svg or .png there and add
  a line here. To replace one, keep the same file name.
*/
window.GUEST_AVATARS = [
  { id: "guest-cat",    file: "guest-cat.svg",    label: "cat" },
  { id: "guest-star",   file: "guest-star.svg",   label: "star" },
  { id: "guest-ghost",  file: "guest-ghost.svg",  label: "ghost" },
  { id: "guest-heart",  file: "guest-heart.svg",  label: "heart" },
  { id: "guest-flower", file: "guest-flower.svg", label: "flower" }
];
