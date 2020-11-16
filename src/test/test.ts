'use strict';
import SeqTransport from '../index';
import winston from 'winston';

winston.add(new SeqTransport(
  {
    apiKey: 'cxl5BEMudau8l2ZbGXDA',
    serverUrl: 'http://localhost:5341'
  }
));

winston.debug('Hello');
