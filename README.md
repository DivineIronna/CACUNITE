# Christ Anglican Church — Youth & Young Adults

This is the website for Youth of Unity and the Young Adults Ministry at
Christ Anglican Church in Marietta, Georgia.

**See it here:** https://divineironna.github.io/CACUNITE/

You don't need to know how to code to update it. Change a file, save it, and
the website updates by itself in about a minute.

## What the files do

- **index.html** — the words on the page
- **styles.css** — the colors and the look
- **script.js** — the events list and the sign-up form
- **images** — all the photos

These four must always stay together. If you move or send just one file, the
website breaks.

## How to change the events

The dates fix themselves. You never type a date like "October 14" — you say
"every Wednesday" once, and the website always shows the next Wednesday.

Open **script.js**. At the top you'll see a list. Each event looks like this:

```js
{
  type: 'BIBLE STUDY',
  lines: ['Young Adult', 'Bible Study'],
  weekday: 3,
  time: { h: 19, m: 0 },
  location: 'Fellowship Hall'
}
```

Here's what each line means:

- **type** — the small label at the top of the card
- **lines** — the big title, split into two lines
- **weekday** — which day it repeats: `0` Sunday, `1` Monday, `2` Tuesday,
  `3` Wednesday, `4` Thursday, `5` Friday, `6` Saturday
- **time** — the hour on a 24-hour clock. `19` means 7 PM. For 9 AM use `9`.
- **location** — where it happens

To add an event that happens only once, swap `weekday` for `date`:

```js
date: [2026, 12, 24],
```

That's year, month, day. So this one is December 24, 2026.

**Three events show at a time** — the three coming up soonest. When an event
finishes, it disappears on its own and the next one takes its place.

**Watch out:** once a one-time event has passed, it's gone for good. Add new
ones before you run out.

## How to change someone on the leadership team

Open **index.html** and look for a block like this:

```html
<article class="leader-card">
  <div class="portrait portrait-one">
    <img class="portrait-photo" src="images/kester-illoka.jpg" alt="Kester Illoka" />
    <span>KI</span>
  </div>
  <p>PRESIDENT</p>
  <h3>Kester Illoka</h3>
</article>
```

To add someone, copy that whole block and change four things:

1. **the photo name** — `images/kester-illoka.jpg`
2. **the initials** — `KI`
3. **the role** — `PRESIDENT` (keep it in capitals)
4. **the name** — `Kester Illoka`

To remove someone, delete the whole block from `<article>` to `</article>`.

The words `portrait-one`, `portrait-two`, `portrait-three` and `portrait-four`
are just background colors. They only show if there's no photo yet. Try not to
give two people sitting next to each other the same one.

## How to add a photo

1. Put the picture in the **images** folder
2. In **index.html**, write the file name where the old one was

**Type the name exactly right, including capital letters.** On your computer
`Photo.JPG` and `photo.jpg` look like the same thing. On the website they are
not, and the picture won't show up.

**Keep pictures small.** Anything over about 500 KB is slow to load on a
phone, and it won't look any better.

If a picture is missing or the name is wrong, nothing breaks. The website just
shows a colored box with the person's initials instead.

## How to change the colors

Open **styles.css**. The colors are all at the very top:

```css
--ink:#161032;        /* dark navy */
--cream:#f8f7fc;      /* page background */
--moss:#2b1f63;       /* purple-blue — big sections and buttons */
--rust:#e06d06;       /* orange */
--rust-text:#9c4c09;  /* darker orange, for small writing */
--rust-deep:#b35305;  /* darker orange, for white writing on top */
--gold:#ffc53a;       /* yellow */
```

Change one of those and it changes everywhere on the website at once.

There are three oranges on purpose. The bright one is hard to read when the
writing is small, so the darker ones are used there. They look the same to
most people.

## About the sign-up form

When someone fills in the form, their answer goes into a Google Form. Open it
and click the **Responses** tab to see who signed up.

**Important:** the website always says "You're on the list" after someone
submits — even if something went wrong. It has no way to know. So after you
change anything about the form, fill it in yourself once and check the answer
really shows up in Responses.

Two things will stop the form working:

- The Google Form isn't **published**
- The Google Form asks people to sign in to Google first

## How to update the website

The website lives on GitHub. When you save a change there, the real website
updates on its own in a minute or two.

The easiest way to edit is to open **vscode.dev** in your browser and choose
*Open Remote Repository*. That way you're always working on the real files, so
your changes can't go missing.

**One thing that confuses everyone:** if you preview `index.html` inside an
online editor, it looks broken — no colors, no photos. That's the preview's
fault, not the website's. Always check the real web address instead.

## Photos

The photos are of members of Youth of Unity and the Young Adults Ministry.
If you're in one and want it taken down, email cacyouthofunity@gmail.com.
[README.md](https://github.com/user-attachments/files/33176026/README.md)
