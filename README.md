## SLITE API Examples

This repository is gathering examples to ease the development of custom workflows based on
our Public API at Slite. All examples are in TypeScript.

### Get Started

Start by cloning the repository and installing the packages and Slite's API definition:

```
npm install
npx api install https://api.slite.com/openapi.json
```

Duplicate the `.env.sample` and rename it to `.env` and fill the data with your own.
For more informations, visit https://developers.slite.com

Next, you can run one of our examples:

```
 ts-node ./examples/1-create-a-doc.ts
```

### Troubleshooting

If you're facing an issues or want us to develop new routes, please drop us a line
at support@slite.com.
