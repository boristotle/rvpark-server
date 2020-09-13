// const terminal =  

//   // Handler for a "Connect Reader" button
// module.exports = {
//     terminal: StripeTerminal.create({
//         onFetchConnectionToken: fetchConnectionToken,
//         onUnexpectedReaderDisconnect: unexpectedDisconnect,
//     }),
//     connectReaderHandler: () => {
//         var config = {simulated: true};
//         terminal.discoverReaders(config).then(function(discoverResult) {
//         if (discoverResult.error) {
//             console.log('Failed to discover: ', discoverResult.error);
//         } else if (discoverResult.discoveredReaders.length === 0) {
//             console.log('No available readers.');
//         } else {
//             // Just select the first reader here.
//             var selectedReader = discoverResult.discoveredReaders[0];
    
//             terminal.connectReader(selectedReader).then(function(connectResult) {
//             if (connectResult.error) {
//                 console.log('Failed to connect: ', connectResult.error);
//             } else {
//                 console.log('Connected to reader: ', connectResult.reader.label);
//             }
//             });
//         }
//         });
//     }
// }