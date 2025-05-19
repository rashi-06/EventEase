import Booking from "../model/Booking.js"
import Event from "../model/Event.js";
import Payment from "../model/Payment.js";

export const createBooking = async(req,res)=>{
    try {
        const {eventId , noOfTickets, userId} = req.body;
        console.log("eventId received:", eventId);
        const event = await Event.findById(eventId);

        if (!event) return res.status(404).json({ message: "Event not found" });
        if(event.availableSeats < noOfTickets) return res.status(400).json({ message: "Not enough available seats" });

        const totalAmt = event.price * noOfTickets;

        const booking = await Booking.create({
            event : eventId,
            user  : userId,     
            numberOfSeats: noOfTickets,
            totalAmount: totalAmt,
        });

        event.availableSeats -= noOfTickets;

        await event.save();
        res.status(201).json(booking);
        
    } catch (error) {
        res.status(500).json({ message: "Booking failed", error: error.message });
    }
};

export const getUserBooking = async(req,res)=>{
    try {
        console.log("userId --> ", req.body.userId);
        
        const bookings  = await Booking.findOne({user : req.body.userId}).populate("event");
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings", error: error.message });
    }
};

export const cancelBooking = async(req,res)=>{
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: "Booking not found" });
        console.log("booking ka user----> ",booking.user);
        console.log("user from req---->", req.body.userId);
        
        
        if (!booking.user.equals(req.body.userId)) {
            return res.status(401).json({ message: "Not authorized to cancel this booking" });
        }

        if (booking.bookingStatus === "Cancelled") {
            return res.status(400).json({ message: "Booking already cancelled" });
        }

         // Restore seats
        const event = await Event.findById(booking.event);
        if (event) {
            event.availableSeats += booking.numberOfSeats;
            await event.save();
        }

        
        booking.bookingStatus = "Cancelled";
         // Refund logic (pseudo-code or call to real payment gateway API)
        const payment = await Payment.findOne({ booking: booking._id });

        if (payment) {
            payment.status = "Refunded"; // or "Cancelled"
            await payment.save();
        }
         // You could also integrate a real refund API here (e.g., Stripe or Razorpay)
        await booking.save();
        res.json({ message: "Booking cancelled", booking });
    } catch (error) {
        res.status(500).json({ message: "Error cancelling booking", error: error.message });
    }
};