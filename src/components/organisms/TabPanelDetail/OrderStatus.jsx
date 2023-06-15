/**
 * Order Status (Order Tracking) tab for User Profile
 * file: OrderStatus.jsx
 */

import { CloseOutlined } from "@mui/icons-material";
import {
  Divider,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebase/firebase-config";
import StatusChip from "../../molecules/StatusChip/StatusChip";
import Orders from "../Orders/Orders";
import { useDispatch, useSelector } from "react-redux";
import { getAPIActionJSON } from "../../../../api/ApiActions";

const headersTable = [
  {
    label: "",
    align: "left",
  },
  {
    label: "Bill ID",
    align: "left",
  },
  {
    label: "Date",
    align: "left",
  },
  {
    label: "Total",
    align: "left",
  },
  {
    label: "Status",
    align: "left",
  },
];

const rowStyle = (fontSize = "16px", fontWeight = "400") => {
  return {
    fontSize: fontSize,
    fontWeight: fontWeight,
    color: "#212b36",
    borderColor: "#f4f6f8",
  };
};

const fontStyle = (
  fontSize = "16px",
  fontWeight = "400",
  fontColor = "#000"
) => {
  return {
    fontFamily: "Satoshi",
    fontWeight: fontWeight,
    fontSize: fontSize,
    lineHeight: "140%",
    color: fontColor,
  };
};

function convertISODateToHumanReadable(isoDate) {
  const date = new Date(isoDate);
  const now = new Date();

  const diff = Math.abs(now - date) / 1000; // Time difference in seconds

  if (diff < 60) {
    return `${Math.floor(diff)}s ago`;
  } else if (diff < 60 * 60) {
    return `${Math.floor(diff / 60)}m ago`;
  } else if (diff < 60 * 60 * 24) {
    return `${Math.floor(diff / (60 * 60))}h ago`;
  } else if (diff < 60 * 60 * 24 * 30) {
    return `${Math.floor(diff / (60 * 60 * 24))}d ago`;
  } else if (diff < 60 * 60 * 24 * 30 * 12) {
    return `${Math.floor(diff / (60 * 60 * 24 * 30))}m ago`;
  } else {
    return `${Math.floor(diff / (60 * 60 * 24 * 30 * 12))}y ago`;
  }
}

const OrderStatus = () => {
  const mdMatches = useMediaQuery("(min-width: 900px)");
  const dispatch = useDispatch();
  // to open a modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // contained of list orders
  // the selected order, used for opening the selected order
  const userId = useSelector((state) => state.users.id);
  const orders = useSelector((state) => state.users.orders);
  useEffect(() => {
    console.log("selected order: ", selectedOrder);
    console.log("order: ", orders);
  }, [orders, selectedOrder]);

  return (
    <div className="user-tab">
      <Typography variant="h3">My Orders</Typography>
      <div
        style={{
          overflowX: "auto",
          margin: "15px 0",
          boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                style={{
                  backgroundColor: "#f4f6f8",
                }}
              >
                {headersTable.map((item, index) => (
                  <TableCell
                    key={index}
                    align={item.align}
                    sx={[
                      rowStyle("16px", "500"),
                      {
                        color: "#2a343e",
                      },
                    ]}
                  >
                    <TableSortLabel hideSortIcon>{item.label}</TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.map((item, index) => (
                <TableRow
                  key={index}
                  hover
                  onClick={() => handleOpenModal(item)}
                  sx={{
                    "&.MuiTableRow-root.MuiTableRow-hover": {
                      cursor: "pointer",
                    },
                  }}
                >
                  <TableCell sx={rowStyle("14px")} align="right">
                    {index + 1}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      ...rowStyle("14px", "500"),
                      maxWidth: "180px",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    #{item.id}
                  </TableCell>
                  <TableCell sx={rowStyle("14px")} align="left">
                    {convertISODateToHumanReadable(item.time)}
                  </TableCell>
                  <TableCell sx={rowStyle("14px")} align="left">
                    ${item.total}
                  </TableCell>
                  <TableCell sx={rowStyle("14px")} align="left">
                    <StatusChip label={item.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Paper
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "90vw",
            maxHeight: "90vh",
            overflow: "auto",
            padding: "24px",
          }}
        >
          {selectedOrder && (
            <div>
              <Typography variant="h4" style={fontStyle()}>
                Order Details
              </Typography>
              <Divider style={{ margin: "12px 0" }} />

              <Typography variant="body1" style={fontStyle("14px", "500")}>
                Bill ID: #{selectedOrder.id}
              </Typography>
              <Typography variant="body1" style={fontStyle("14px", "500")}>
                Date: {convertISODateToHumanReadable(selectedOrder.time)}
              </Typography>
              <Typography variant="body1" style={fontStyle("14px", "500")}>
                Total: ${selectedOrder.total}
              </Typography>
              <Typography variant="body1" style={fontStyle("14px", "500")}>
                Status: <StatusChip label={selectedOrder.status} />
              </Typography>
            </div>
          )}

          <div style={{ textAlign: "right", marginTop: "24px" }}>
            <CloseOutlined
              style={{ cursor: "pointer", fontSize: "20px" }}
              onClick={handleCloseModal}
            />
          </div>
        </Paper>
      </Modal>
    </div>
  );
};

export default OrderStatus;
