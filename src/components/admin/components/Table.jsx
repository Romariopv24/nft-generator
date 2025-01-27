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
import { enqueueSnackbar } from "notistack"
import { useState } from "react"
import { useIntl } from "react-intl"
import { URL } from "../../../constantes"

export default function Table({ dataAdmin }) {
  const intl = useIntl()

  const [open, setOpen] = useState(false)
  const [info, setInfo] = useState([])
  const outLinedInputStyle = {
    border: "1px solid #00B8FF",
    borderRadius: "15px",
    marginBottom: 3.5,
    color: "white",
    width: "95%"
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
      headerName: intl.formatMessage({
        id: "Send.mail",
        defaultMessage: "Send mail"
      }),
      width: 150,
      headerClassName: "super-app-theme--header",
      headerAlign: "center",
      cellClassName: "super-app-theme--cell",
      renderCell: (e) => {
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
    const [inputs, setInputs] = useState({
      subject: "",
      text: ""
    })

    const handleChangeSubject = (e) =>
      setInputs({ ...inputs, subject: e.target.value })

    const handleChangeText = (e) =>
      setInputs({ ...inputs, text: e.target.value })

    const handleSubmit = async () => {
      let url = `${URL}sendadminmail`

      const obj = {
        asunto: inputs.subject,
        mensaje: inputs.text,
        email: info.correo
      }
      var myHeaders = new Headers()
      myHeaders.append(
        "Authorization",
        `Bearer ${localStorage.getItem("access_token")}`
      )
      myHeaders.append("Content-Type", "application/json")

      let myInit = {
        method: "POST",
        body: JSON.stringify(obj),
        headers: myHeaders
      }

      const messageSuccess = intl.formatMessage({
        id: "message.sent",
        defaultMessage: "Message sent successfully"
      })

      const messageError = intl.formatMessage({
        id: "message.error",
        defaultMessage: "An error has ocurred:"
      })

      try {
        let response = await fetch(url, myInit)
        let data = await response.json()
        setInputs({ subject: "", text: "" })
        setOpen(false)
        if (data.mensaje === "Correo enviado exitosamente") {
          enqueueSnackbar(messageSuccess, {
            variant: "success",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right"
            }
          })
        }
      } catch (error) {
        console.log(error)
        enqueueSnackbar(`${messageError} ${error}`, {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right"
          }
        })
      }
    }

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
                {intl.formatMessage({
                  id: "message.to",
                  defaultMessage: "MESSAGE TO"
                })}
              </Typography>
              <Typography fontSize={"2rem"} textAlign={"center"}>
                {info.nombre}
              </Typography>
              <Box
                sx={{
                  mx: "auto",
                  borderBottom: "2px solid #00B8FF",
                  width: "50%"
                }}
              />
              <Typography fontSize={"17px"} fontWeight={"bold"} mt={4}>
                {intl.formatMessage({
                  id: "write.subject",
                  defaultMessage: "Write the subject"
                })}
              </Typography>
              <OutlinedInput
                name="subject"
                sx={outLinedInputStyle}
                onChange={handleChangeSubject}
              />
              <Typography fontSize={"17px"} fontWeight={"bold"} mt={2}>
                {intl.formatMessage({
                  id: "write.message",
                  defaultMessage: "Write the message"
                })}
              </Typography>
              <OutlinedInput
                sx={outLinedInputStyle}
                name="text"
                onChange={handleChangeText}
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
                    backgroundColor: "darkred" 
                  }
                }}
              >
                {intl.formatMessage({
                  id: "button.cancel",
                  defaultMessage: "Cancel"
                })}
              </Button>

              <Button
                onClick={handleSubmit}
                sx={{
                  backgroundColor: "#00B8FF",
                  margin: "0 5px",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "darkblue" // Mismo color de fondo al hacer hover
                  }
                }}
              >
                {intl.formatMessage({
                  id: "button.send",
                  defaultMessage: "Send"
                })}
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
          border: "3px solid #333333",
          borderRadius: "0px",
          "&. MuiDataGrid-row": {
            backgroundColor:'#1C1C1C',
            border: '0px',
          },
          "& div": {
            borderRadius: '0px',
            border: '0' 
          },
          "& .super-app-theme--cell": {
            display: "flex",
            justifyContent: "center",
            borderBottom: "1px solid #333333",
            backgroundColor:'#1C1C1C',
            "&:hover": {
             backgroundColor: '#2E2E2E'
          }
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
            backgroundColor: "#010101",
            borderBottom: "1px solid #333333",
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
            backgroundColor: "#2731C8",
            // borderRadius: "20px"
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb:hover": {
            // backgroundColor: "#010101",
            background: "#12175f"
          },
          "& .MuiDataGrid-menuIcon": {
            display: "none"
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#010101",
          },
          "& .MuiDataGrid-footerContainer":{
            backgroundColor: "#010101",
          }
        }}
      />
      <ModalDialog />
    </Box>
  )
}
