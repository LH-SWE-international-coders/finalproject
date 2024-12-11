// "use client"

// import * as React from "react"
// // import { CalendarIcon } from "@radix-ui/react-icons"
// import { format } from "date-fns"

// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from "@/components/ui/popover"
// import { Input } from "@/components/ui/input"

// interface DateTimePickerProps
//     extends React.InputHTMLAttributes<HTMLInputElement> {
//     id: string
// }

// export function DateTimePicker({ }: DateTimePickerProps) {
//     const [date, setDate] = React.useState<Date>()

//     return (
//         <Popover>
//             <PopoverTrigger asChild>
//                 <Button
//                     variant={"outline"}
//                     className={cn(
//                         "w-full justify-start text-left font-normal",
//                         !date && "text-muted-foreground"
//                     )}
//                 >
//                     {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
//                     {date ? format(date, "PPP HH:mm") : <span>Pick a date</span>}
//                 </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar
//                     mode="single"
//                     selected={date}
//                     onSelect={setDate}
//                     initialFocus
//                 />
//                 <div className="p-3 border-t">
//                     <Input
//                         type="time"
//                         onChange={(e) => {
//                             const [hours, minutes] = e.target.value.split(':')
//                             const newDate = date ? new Date(date) : new Date()
//                             newDate.setHours(parseInt(hours, 10))
//                             newDate.setMinutes(parseInt(minutes, 10))
//                             setDate(newDate)
//                         }}
//                     />
//                 </div>
//             </PopoverContent>
//         </Popover>
//     )
// }

