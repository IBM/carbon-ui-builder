# Carbon UI Builder - UI Fragment Composer by IBM

Carbon UI Builder is a visual builder tool for Carbon UI components allowing you to
build product pages in a fraction of time that it normally take.

Export in seconds as

* image for presentations
* live demo app for user testing or
* production quality code

and incorporate in the existing product frontend.

No coding required.

[See it in action!](https://builder.carbondesignsystem.com)

## Privacy

All your data is safely stored on your computer, never leaving the browser.
This means that the Carbon UI Builder works even if you don't have internet connection.

## What's Carbon, anyway?

It's [IBM's design system](https://www.carbondesignsystem.com/) with ready-to-go component implementations
in Angular, React and Vue.

## Development and self-hosting

In the project directory, you can run:

### `npm install`

Installs all the required packages and it's only needed the first time, and when you update.

### `npm start`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder. The build artifacts will be stored in the `dist/` directory, ready to be deployed.

## Start the app

To start the development server run `nx serve carbon-ui-builder`. Open your browser and navigate to http://localhost:4200/. Happy coding!


## Generate code

If you happen to use Nx plugins, you can leverage code generators that might come with it.

Run `nx list` to get a list of available plugins and whether they have generators. Then run `nx list <plugin-name>` to see what generators are available.

Learn more about [Nx generators on the docs](https://nx.dev/plugin-features/use-code-generators).

## Running tasks

To execute tasks with Nx use the following syntax:

```
nx <target> <project> <...options>
```

You can also run multiple targets:

```
nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/core-features/run-tasks).

## Want better Editor Integration?

Have a look at the [Nx Console extensions](https://nx.dev/nx-console). It provides autocomplete support, a UI for exploring and running tasks & generators, and more! Available for VSCode, IntelliJ and comes with a LSP for Vim users.

