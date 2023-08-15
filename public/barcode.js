const startScanButton = document.getElementById('startScanButton');
        const cameraStream = document.getElementById('camera-stream');
        let scannerStarted = false;

        startScanButton.addEventListener('click', function() {
            if (!scannerStarted) {
                startBarcodeScanning();
                scannerStarted = true;
            }
        });

        function startBarcodeScanning() {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function(stream) {
                    cameraStream.srcObject = stream;
                    cameraStream.play();

                    // Initialize QuaggaJS with the settings for barcode scanning
                    Quagga.init({
                        inputStream: {
                            name: "Live",
                            type: "LiveStream",
                            target: cameraStream
                        },
                        decoder: {
                            readers: ["ean_reader"] // Specify the type of barcode you want to scan
                        }
                    });

                    // Set up an event listener for when a barcode is detected
                    Quagga.onDetected(function(result) {
                        console.log("Barcode detected:", result.codeResult.code);
                        // Do something with the barcode information
                    });

                    // Start barcode scanning
                    Quagga.start();
                })
                .catch(function(error) {
                    console.error("Camera access error:", error);
                });
        }