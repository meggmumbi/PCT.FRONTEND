import React, { useMemo } from "react";
import {
    Box,
    Button,
    
  } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MaterialReactTable from "material-react-table";

const FileTable = ({ files,onRemoveFile,handleOpen }) => {

  
  const columns = useMemo(
    () => [
      {
        accessorKey: 'fileName',
        header: 'FileName',
      },
      {
        accessorKey: 'version',
        header: 'Version',
      }
    ],
    [onRemoveFile]
  );

  if (!files) {
    return <div>Error: Invalid data</div>;
  }

  return (
    <MaterialReactTable
      columns={columns}
      data={files}
      title="File Table"
      options={{
        paging: true,
        toolbar: true,
      }}
      enableRowActions
      positionActionsColumn="last"
      renderRowActions={({ row, table }) => {
        return (
          <>
            <Button
              startIcon={<DeleteIcon />}
              size="small"
              onClick={() => onRemoveFile(row.original.fileName,row.original.version)}
            ></Button>
           
          </>
        )
      }}
      renderTopToolbarCustomActions={({ table }) => (
        <Box
            sx={{
                display: "flex",
                gap: "1rem",
                p: "4px",
                right: "15px",
                position: "absolute",
            }}
        >
            <Button
                variant="contained"
                startIcon={<AddCircleIcon />}
                onClick={handleOpen}
                sx={{
                    fontWeight: 'bolder',
                    backgroundColor: '#333333',
                    "&:hover": {
                        background: "#333333",
                        color: "white"
                    }
                }}
            >
                Add Version
            </Button>
        </Box>
    )}
    />
  );
};

export default FileTable;
