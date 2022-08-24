('use strict');

import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';

if (process.env['HONEYCOMB_ENABLED'] == 'true') {
    // The Trace Exporter exports the data to Honeycomb and uses
    // the environment variables for endpoint, service name, and API Key.
    console.info('Running with Honeycomb instrumentation!');

    const traceExporter = new OTLPTraceExporter();

    const sdk = new NodeSDK({
        traceExporter,
        instrumentations: [getNodeAutoInstrumentations()]
    });

    sdk.start();
} else {
    console.info('Running without instrumentation');
}