import { Box, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useIntl } from "react-intl"

export default function Table({ dataAdmin }) {
  const intl = useIntl()

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
    }
  ]

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
    </Box>
  )
}
