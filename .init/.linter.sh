#!/bin/bash
cd /home/kavia/workspace/code-generation/pdf-to-web-converter-ff7f7a27/pdf_converter_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

