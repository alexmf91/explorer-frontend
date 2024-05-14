import { QubicTransferSendManyPayload } from 'qubic-ts-library/dist/qubic-types/transacion-payloads/QubicTransferSendManyPayload';

const fetchEntries = async (data) => {
  const binaryData = new Uint8Array(
    atob(data)
      .split('')
      .map(function (c) {
        return c.charCodeAt(0);
      })
  );
  const sendManyPayload = binaryData.slice(binaryData.length - 1064, binaryData.length - 64);

  const parsedSendManyPayload = await new QubicTransferSendManyPayload().parse(sendManyPayload);

  const transfers = parsedSendManyPayload.getTransfers();

  const standardizedData = transfers.map((item) => ({
    amount: item.amount.value.toString(),
    destId: item.destId.identity,
  }));

  return standardizedData;
};

const formatString = (string) => {
  return string ? Number(string).toLocaleString('en-US') : '0';
};

const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
    hour12: true,
  };

  if (dateString) {
    let date;
    if (dateString.includes('T')) {
      date = new Date(dateString);
    } else {
      const timestamp = parseInt(dateString, 10); // Include the radix parameter
      date = new Date(timestamp);
    }
    return new Intl.DateTimeFormat('en-US', options).format(date); // Format date
  }
  return '';
};
function formatEllipsis(str) {
  if (str) {
    if (str.length > 10) {
      return `${str.substr(0, 5)}...${str.substr(-5)}`;
    }
    return str;
  }
  return '';
}

function formatBase64(hex) {
  if (hex) {
    const bytes = hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16));
    const uint8Array = new Uint8Array(bytes);
    const byteArray = Array.from(uint8Array);
    const byteString = String.fromCharCode.apply(null, byteArray);
    const base64String = btoa(byteString);
    return base64String;
  }
  return '';
}

function copyText(textToCopy) {
  const input = document.createElement('input');
  input.value = textToCopy;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
}

export { fetchEntries,formatString, formatDate, formatEllipsis, formatBase64, copyText };
