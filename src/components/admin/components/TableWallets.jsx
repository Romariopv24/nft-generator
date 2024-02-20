import { Box, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"

export default function TableWallets({ getWallet }) {
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
    </Box>
  )
}

const columns = [
  {
    field: "correo",
    headerName: "correo",
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
    headerName: "wallet",
    type: "number",
    width: 400,
    headerAlign: "center",
    cellClassName: "super-app-theme--cell",
    editable: true,
    renderCell: (e) => {
      return <Typography fontSize={"15px"}>{e.row.usuario}</Typography>
    }
  }
  // {
  //   field: "delete",
  //   headerName: "Delete",
  //   type: "number",
  //   width: 110,
  //   headerAlign: "center",
  //   cellClassName: "super-app-theme--cell",
  //   renderCell: (e) => {
  //     // return <Delete sx={{ cursor: "pointer" }} color="red" />
  //   }
  // }
]

const rows = [
  {
    id: 1,
    user: "Snow@gmail.com",
    wallet: "0xa54927b7af64DdB3e2c5Ac9cbec38c81EC88Be48"
  }
]
