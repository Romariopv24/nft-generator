import { Delete } from "@mui/icons-material"
import { Box, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { enqueueSnackbar } from "notistack"
import { useIntl } from "react-intl"
import { axiosClass } from "../../../api/api.config"

export default function TableWallets({ getWallet, setGetWallet }) {
  const intl = useIntl()

  const putUser = (wallet) => {
    const walletAlertSuccess = intl.formatMessage({
      id: "free.wallet.remove",
      defaultMessage: "Wallet has successfully removed!"
    })

    const walletAlertError = intl.formatMessage({
      id: "free.wallet.remove.error",
      defaultMessage: "An error has ocurred, please try again"
    })

    axiosClass
      .put("/setwallet", { wallet: wallet })
      .then((res) => {
        if (res.status === 200) {
          const getAFeeling = getWallet.findIndex(
            (index) => index.wallet === wallet
          )

          const updatedWallet = [...getWallet]
          updatedWallet.splice(getAFeeling, 1)

          setGetWallet(updatedWallet)
          enqueueSnackbar(walletAlertSuccess, {
            variant: "success",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right"
            }
          })
        }
      })
      .catch((err) => {
        enqueueSnackbar(walletAlertError, {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right"
          }
        })
      })
  }
  const columns = [
    {
      field: "correo",
      headerName: intl.formatMessage({
        id: "contact.email",
        defaultMessage: "Email"
      }),
      width: 270,
      headerAlign: "center",
      cellClassName: "super-app-theme--cell",
      editable: true,
      renderCell: (e) => {
        return <Typography fontSize={"15px"}>{e.row.correo}</Typography>
      }
    },
    {
      field: "wallet",
      headerName: "Wallet",
      type: "number",
      width: 400,
      headerAlign: "center",
      cellClassName: "super-app-theme--cell",
      editable: true,
      renderCell: (e) => {
        return <Typography fontSize={"15px"}>{e.row.usuario}</Typography>
      }
    },
    {
      field: "delete",
      headerName: "",
      type: "number",
      width: 110,
      headerAlign: "center",
      cellClassName: "super-app-theme--cell",
      renderCell: (e) => {
        return (
          <Delete
            onClick={() => {
              putUser(e.row.usuario)
            }}
            sx={{ cursor: "pointer" }}
            color="red"
          />
        )
      }
    }
  ]

  return (
    <Box sx={{ height: 400, width: "100%", marginTop: 5 }}>
      <DataGrid
        rows={getWallet}
        columns={columns}
        getRowId={(e) => e._id.$oid}
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
          // borderRadius: "20px",
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
            borderRadius: "20px"
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb:hover": {
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
    </Box>
  )
}
