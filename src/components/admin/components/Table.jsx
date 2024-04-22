import { Send } from "@mui/icons-material"
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  OutlinedInput,
  Stack,
  Typography
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useState } from "react"
import { useIntl } from "react-intl"

export default function Table({ dataAdmin }) {
  const intl = useIntl()

  const [open, setOpen] = useState(false)
  const [info, setInfo] = useState([])
  const outLinedInputStyle = {
    border: "1px solid #00B8FF",
    borderRadius: "15px",
    marginTop: 3.5,
    marginBottom: 3.5,
    color: "white",
    width: "95%"
  }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: "90%", md: "90%", lg: "60%", xl: "45%" },
    bgcolor: "#000446",
    boxShadow: 24,
    p: 4,
    border: "1px solid #00B8FF",
    display: "flex",
    justifyContent: "start",
    flexDirection: "column",
    textAlign: "center",
    alignItems: "center"
  }

  const columns = [
    {
      field: "nombre",
      headerName: intl.formatMessage({
        id: "table.admin.name-collection",
        defaultMessage: "Collection Name"
      }),
      width: 300,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      cellClassName: "super-app-theme--cell"
    },
    {
      field: "correo",
      headerName: intl.formatMessage({
        id: "table.admin.user",
        defaultMessage: "User"
      }),
      width: 500,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      cellClassName: "super-app-theme--cell"
    },
    {
      field: "peso",
      headerName: intl.formatMessage({
        id: "table.admin.size",
        defaultMessage: "Size"
      }),
      width: 150,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      cellClassName: "super-app-theme--cell"
    },
    {
      field: "fecha",
      headerName: intl.formatMessage({
        id: "table.admin.download",
        defaultMessage: "Download Date"
      }),
      width: 190,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      cellClassName: "super-app-theme--cell",
      renderCell: (e) => {
        const today = new Date(e.row.fecha)
        return (
          <Typography textAlign={"center"} color={"white"} fontWeight={"bold"}>
            {today.toLocaleDateString("en-US")}
          </Typography>
        )
      }
    },
    {
      field: "email",
      headerName: "Send Email",
      width: 200,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      cellClassName: "super-app-theme--cell",
      renderCell: (e) => {
        console.log(e.row)

        return (
          <>
            <Stack flexDirection={"row"} alignItems={"center"} gap={3}>
              <Send
                onClick={() => {
                  setOpen(true)
                  setInfo(e.row)
                }}
                sx={{ cursor: "pointer", height: "17px", color: "#00B8FF" }}
              />
            </Stack>
          </>
        )
      }
    }
  ]

  const ModalDialog = () => {
    return (
      <Dialog
        onClose={() => setOpen(false)}
        open={open}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "15px"
          }
        }}
      >
        <Box
          style={{
            backgroundColor: "#000446",
            border: "1px solid #00B8FF",
            width: "500px"
          }}
        >
          <DialogContent
            maxWidth="xl"
            width={1200}
            onClose={() => setOpen(false)}
            open={open}
          >
            <Stack direction={"column"}>
              <Typography fontSize={"2rem"} textAlign={"center"}>
                mensaje para
              </Typography>
              <Typography fontSize={"2rem"} textAlign={"center"}>
                {info.name}
              </Typography>
              <Box
                sx={{
                  mx: "auto",
                  borderBottom: "2px solid #00B8FF",
                  width: "50%"
                }}
              />
              <Typography mt={2}>
                {/* {language[selectedLanguage].sendMessageFromApp.writeSub} */}
                subject
              </Typography>
              <OutlinedInput
                name="subject"
                sx={outLinedInputStyle}
                // onChange={handleNotiChange}
              />
              <Typography mt={2}>
                {/* {language[selectedLanguage].sendMessageFromApp.writeMess}{" "} */}
                escribe un mensaje
              </Typography>
              <OutlinedInput
                sx={outLinedInputStyle}
                name="text"
                // onChange={handleNotiChange}
                multiline
                maxRows={4}
              />
            </Stack>

            <Stack direction={"row"} m={3} justifyContent={"space-between"}>
              <Button
                onClick={() => setOpen(false)}
                sx={{
                  backgroundColor: "red",
                  margin: "0 5px",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "darkred" // Mismo color de fondo al hacer hover
                  }
                }}
              >
                {/* {language[selectedLanguage].sendMessageFromApp.cancelBtn} */}
                cancel
              </Button>

              <Button
                // onClick={sendNoti}
                sx={{
                  backgroundColor: "#00B8FF",
                  margin: "0 5px",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "darkblue" // Mismo color de fondo al hacer hover
                  }
                }}
              >
                {/* {language[selectedLanguage].sendMessageFromApp.sendBtn} */}
                send
              </Button>
            </Stack>
          </DialogContent>
        </Box>
      </Dialog>
    )
  }

  return (
    <Box sx={{ height: 400, width: "75%", marginBottom: 10 }}>
      <DataGrid
        rows={dataAdmin.length !== 0 ? dataAdmin : []}
        columns={columns}
        getRowId={(e) => e._id}
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
        sx={{
          display: "flex",
          justifyContent: "center",
          color: "white",
          border: "3px solid #6772af",
          borderRadius: "20px",
          "& .super-app-theme--cell": {
            display: "flex",
            justifyContent: "center"
          },
          "& .MuiToolbar-root": {
            color: "white"
          },
          "& MuiTablePagination-actions": {
            color: "white"
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
            width: "5px",
            height: "10px"
          },
          "& .MuiDataGrid-columnHeaderTitle ": {
            color: "white",
            fontWeight: "bold"
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#2731C8",
            borderRadius: "15px 15px"
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
            backgroundColor: "#2731C8",
            borderRadius: "20px"
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb:hover": {
            background: "#12175f"
          },
          "& .MuiDataGrid-menuIcon": {
            display: "none"
          }
        }}
      />
      <ModalDialog />
    </Box>
  )
}
