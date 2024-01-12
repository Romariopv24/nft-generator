import { Box } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"

const columns = [
  {
    field: "name",
    headerName: "Name Collection",
    width: 200,
    headerClassName: "super-app-theme--header",
    headerAlign: "center",
    cellClassName: "super-app-theme--cell"
  },
  {
    field: "User",
    headerName: "User",
    width: 330,
    headerClassName: "super-app-theme--header",
    headerAlign: "center",
    cellClassName: "super-app-theme--cell"
    // renderCell: (e) => {
    //   const [open, setOpen] = useState(false)
    //   const [notificationBody, setNotificationBody] = useState({
    //     subject: "",
    //     text: ""
    //   })
    //   const handleClose = () => {
    //     setOpen(false)
    //   }
    //   console.log(e.row.name)
    //   const handleNotiChange = (event) => {
    //     setNotificationBody({
    //       ...notificationBody,
    //       [event.target.name]: event.target.value
    //     })
    //   }

    //   const sendNoti = () => {
    //     axiosPost("/reply", {
    //       recipient_email: e.row.email,
    //       reply_subject: notificationBody.subject,
    //       reply_message_body: notificationBody.text
    //     }).then((res) => {
    //       if (res) {
    //         CustomAlert.fire({
    //           title:
    //             language[selectedLanguage].sendMessageFromApp.alertSuccess,

    //           icon: "success"
    //         })
    //         handleClose()
    //       }
    //     })
    //   }

    //   return (
    //     <>
    //       <Stack flexDirection={"row"} alignItems={"center"} gap={3}>
    //         <Typography>{e.row.email}</Typography>
    //         <Send
    //           onClick={() => {
    //             setOpen(true)
    //           }}
    //           sx={{ cursor: "pointer", height: "17px", color: "#FF004F" }}
    //         />
    //       </Stack>

    //       <Dialog
    //         maxWidth="xl"
    //         width={1200}
    //         onClose={handleClose}
    //         open={open}
    //         sx={{
    //           zIndex: (theme) => theme.zIndex.drawer + 1,
    //           backgroundColor: "rgba(0, 0, 0, 0.7)",
    //           backdropFilter: "blur(5px)" // Agrega el filtro de desenfoque
    //         }}
    //       >
    //         <div
    //           style={{
    //             backgroundColor: "#121220",
    //             color: "#fff",
    //             border: "3px solid #FF004F",
    //             width: "500px"
    //           }}
    //         >
    //           <DialogContent
    //             maxWidth="xl"
    //             width={1200}
    //             onClose={handleClose}
    //             open={open}
    //           >
    //             <Stack direction={"column"}>
    //               <Typography fontSize={"2rem"} textAlign={"center"}>
    //                 {" "}
    //                 {
    //                   language[selectedLanguage].sendMessageFromApp.messageTo
    //                 }{" "}
    //               </Typography>
    //               <Typography fontSize={"2rem"} textAlign={"center"}>{e.row.name}</Typography>
    //               <Box
    //                 sx={{
    //                   mx: "auto",
    //                   borderBottom: "2px solid #ff004f",
    //                   width: "50%"
    //                 }}
    //               />
    //               <Typography my={2}>
    //                 {language[selectedLanguage].sendMessageFromApp.writeSub}
    //               </Typography>
    //               <TextField
    //                 name="subject"
    //                 onChange={handleNotiChange}
    //                 sx={{
    //                   "& fieldset": {
    //                     borderColor: "transparent !important"
    //                   }
    //                 }}
    //               />
    //               <Typography my={2}>
    //                 {language[selectedLanguage].sendMessageFromApp.writeMess}{" "}
    //               </Typography>
    //               <TextField
    //                 sx={{
    //                   "& fieldset": {
    //                     borderColor: "transparent !important"
    //                   }
    //                 }}
    //                 name="text"
    //                 onChange={handleNotiChange}
    //                 multiline
    //                 maxRows={4}
    //               />
    //             </Stack>

    //             <Stack
    //               direction={"row"}
    //               m={3}
    //               justifyContent={"space-between"}
    //             >
    //               <Button
    //                 onClick={handleClose}
    //                 sx={{
    //                   backgroundColor: "red",
    //                   margin: "0 5px",
    //                   "&:hover": {
    //                     backgroundColor: "darkred" // Mismo color de fondo al hacer hover
    //                   }
    //                 }}
    //               >
    //                 {language[selectedLanguage].sendMessageFromApp.cancelBtn}
    //               </Button>

    //               <Button
    //                 onClick={sendNoti}
    //                 sx={{
    //                   backgroundColor: "blue",
    //                   margin: "0 5px",
    //                   "&:hover": {
    //                     backgroundColor: "darkblue" // Mismo color de fondo al hacer hover
    //                   }
    //                 }}
    //               >
    //                 {language[selectedLanguage].sendMessageFromApp.sendBtn}
    //               </Button>
    //             </Stack>
    //           </DialogContent>
    //         </div>
    //       </Dialog>
    //     </>
    //   )
    // }
  },
  {
    field: "size",
    headerName: "Image Size",
    width: 240,
    headerClassName: "super-app-theme--header",
    headerAlign: "center",
    cellClassName: "super-app-theme--cell"
    // renderCell: (e) => {
    //   // const handleRadioChange = (event) => {
    //   //   const newStatus = event.target.value
    //   //   updateInfoStatus(e.row._id, newStatus)
    //   // }

    //   return (
    //     <>
    //       <Radio
    //         checked={radioStates[e.row._id] === "pending"}
    //         onChange={handleRadioChange}
    //         value="pending"
    //         name="radio-buttons"
    //         inputProps={{ "aria-label": "B" }}
    //         color="warning"
    //       />
    //       <Radio
    //         checked={radioStates[e.row._id] === "completed"}
    //         onChange={handleRadioChange}
    //         value="completed"
    //         color="success"
    //         name="radio-buttons"
    //         inputProps={{ "aria-label": "C" }}
    //       />
    //       <Typography fontSize={"1em"} color="white">
    //         {radioStates[e.row._id]}
    //       </Typography>
    //     </>
    //   )
    // }
  },
  {
    field: "date",
    headerName: "Date Download",
    width: 100,
    headerClassName: "super-app-theme--header",
    headerAlign: "center",
    cellClassName: "super-app-theme--cell"
  },
]

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 }
]
export default function Table() {
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5
            }
          }
        }}
        pageSizeOptions={[5]}
        checkboxSelection={false}
        disableRowSelectionOnClick
      />
    </Box>
  )
}
