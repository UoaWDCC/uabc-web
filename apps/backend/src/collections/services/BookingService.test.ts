import { clearCollection, testPayloadObject } from "@/test-config/backend-utils"
import { bookingCreateMock } from "@/test-config/mocks/Booking.mock"
import dotenv from "dotenv"
import BookingService from "./BookingService"

dotenv.config()

const bookingService = new BookingService()

describe("booking service", () => {
  afterEach(async () => {
    await clearCollection(testPayloadObject, "booking")
  })

  it("should create a booking document", async () => {
    const newBooking = await bookingService.createBooking(bookingCreateMock)
    const fetchedBooking = await testPayloadObject.find({
      collection: "booking",
      where: {
        id: {
          equals: newBooking.id,
        },
      },
    })
    expect(fetchedBooking.docs[0]).toEqual(newBooking)
  })
})
