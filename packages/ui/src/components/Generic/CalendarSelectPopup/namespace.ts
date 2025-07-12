import { BackButton } from "./BackButton"
import { CalendarSelectPopup as CalendarSelectPopupComponent } from "./CalendarSelectPopup"
import { Body, Content, Header } from "./Content"
import { NextButton } from "./NextButton"

// Create a properly typed Root component that supports generics
const Root = CalendarSelectPopupComponent as typeof CalendarSelectPopupComponent

export { Content, Body, Header, Root, BackButton, NextButton }
