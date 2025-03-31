import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const MonitoringPage: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        시스템 모니터링
      </Typography>

      {/* Kibana 대시보드 iframe */}
      <Paper sx={{ p: 2, height: "calc(100vh - 120px)" }}>
        <iframe
          src="https://www.pinjun.xyz/kibana/app/dashboards#/view/Metricbeat-system-overview-ecs?embed=true&_g=(refreshInterval:(pause:!t,value:60000),time:(from:now-15m,to:now))"
          width="100%"
          height="100%"
          style={{ border: "none" }}
          title="Kibana Dashboard"
        />
      </Paper>
    </Box>
  );
};

export default MonitoringPage;
