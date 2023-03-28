
# TicketLess Entry System To Heritage Sites

A ticketless entry system for historical sites is a system that eliminates the need for physical tickets and allows visitors to enter the site through digital means. Our website tries to reduce the need for physical tickets.This we are trying to achieve by allowing Visitors to purchase tickets through our website and receive a digital confirmation that can be presented at the entrance. Visitors can scan a QR code on their mobile device to gain entry. 

We are trying to divide our system in two parts, firstly client side which is responsible for handling all the client requests regarding ticket booking and another one which is admin side which is responsible for verifying digital confirmation the user has received. 

Users will need to register themselves on our site so that we can share records centrally with our system which will be replicated back at historical sites. On registering users will get options to choose sites and also slots according to their preference. Users can book their ticket and make payment which will be verified by systems at sites.  We are also trying to  allow users to make changes if they want before the actual visit. 

Once verified successfully users will be granted entry into the site. Once entered into the site the same ticket will be disallowed for further usage. Thus by means of that it reduces the time of the user for ticket booking and makes it more convenient for visitors


# Context and goal

I have done this application for a school project and wanted to try to do a mobile app in using web technologies I am familiar with. Having none mobile background, it was a leap in the dark but in the same time it was really exciting.

This app is made to be simple and may help people knowing React & Redux to get into creating mobile apps. It's made with React Native, coupled with some extra nice packages to handle routing, dataflow and UI elements.

## Preview

![gif preview](https://raw.githubusercontent.com/ajaykrathod/ticketless/main/TicketLessVerify.gif)

> Note: 3MB size GIF, might take some time to load

## Main technologies used

- [React Native](https://github.com/facebook/react-native)

> A framework for building native apps with React.

- [React Native Elements](https://github.com/react-native-community/react-native-elements)

> Cross Platform React Native UI Toolkit

- [React Navigation](https://reactnavigation.org/)

> React Native Router based on new React Native Navigation API

## Running the project

- Clone this project
```
git clone < project-url.git >
```

- [Install NodeJS](https://nodejs.org/en/) on your computer.

- [Install yarn](https://yarnpkg.com/en/docs/install) on your computer
> Yarn is a dependency manager built by facebook and google. It is a more efficient and reliable (thanks to yarn.lock) alternative of npm.

- Launch ``` yarn ``` command in a terminal opened in the project folder.
> This command will look into the *package.json* file and install all the dependencies listed here.

- Install react-native-cli globally on your computer
```
yarn global add react-native-cli
```

### Android steps

- Launch a virtual android device [(through *Android Studio* for instance)](https://developer.android.com/studio/run/managing-avds.html#viewing)

> If you have never installed any android virtual device, [follow those instructions](https://developer.android.com/studio/run/managing-avds.html#createavd)

- Then, run the project in executing on your project folder:

```
react-native run-android
```
