const dnsd = require('dnsd');

// Configurar registros DNS
const records = {
  'example.com': {
    A: '192.0.2.1',
    NS: 'ns1.example.com',
    SOA: {
      primary: 'ns1.example.com',
      admin: 'admin.example.com',
      serial: 2023062201,
      refresh: 3600,
      retry: 600,
      expire: 1209600,
      ttl: 3600
    }
  },
  'ns1.example.com': {
    A: '192.0.2.2'
  }
};

// Crear el servidor DNS
const server = dnsd.createServer((req, res) => {
  const domain = req.question[0].name;
  const type = req.question[0].type;

  if (type === 'AXFR'|| type === 'axfr' && records[domain]) {
    // Manejar la transferencia de zona
    const zone = records[domain];
    res.answer.push({
      name: domain,
      type: 'SOA',
      data: {
        mname: zone.SOA.primary,
        rname: zone.SOA.admin,
        serial: zone.SOA.serial,
        refresh: zone.SOA.refresh,
        retry: zone.SOA.retry,
        expire: zone.SOA.expire,
        minimum: zone.SOA.ttl
      },
      ttl: zone.SOA.ttl
    });
    for (let recordType in zone) {
      if (recordType !== 'SOA') {
        res.answer.push({
          name: domain,
          type: recordType,
          data: zone[recordType],
          ttl: 600
        });
      }
    }
  } else if (records[domain] && records[domain][type]) {
    // Manejar otras consultas DNS
    res.answer.push({
      name: domain,
      type: type,
      data: records[domain][type],
      ttl: 600
    });
  }

  res.end();
});

server.listen(3053, '127.0.0.1', () => {
  console.log('DNS server running at 127.0.0.1:3053');
});

