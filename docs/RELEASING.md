# Releasing

Only the owner releases. Agents never tag, publish or create a release.

There is no release yet: the repository is planning-only. A release here means a tagged commit on `main` of the offline simulator, with no package published (the project is not an npm package).

## Steps (owner)

1. `main` is green on CI (Linux and Windows) and every ticket of the epic that the release covers is merged.
2. On a clean checkout of `main`, run `npm test` and `node scripts/walkthrough.js` (planned, introduced by the epic tickets) and confirm both pass. Complete the keyboard walkthrough in the README in a normal browser.
3. Move the `Unreleased` entries in `CHANGELOG.md` under a new version heading with the date, in a pull request, and merge it.
4. Tag the merge commit (`git tag -a vX.Y.Z`), push the tag and create the GitHub release from the changelog text.

A licence has not been selected (owner decision D1); settle it before the first public release.
