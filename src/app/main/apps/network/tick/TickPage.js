import _ from 'lodash';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTheme } from '@mui/material/styles';
import {
  Breadcrumbs,
  IconButton,
  LinearProgress,
  Typography,
  MenuItem,
  Select,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatBase64, formatDate, formatString } from 'src/app/utils/functions';
import { transactionOptions } from 'src/app/utils/constants';
import { ArrowIcon } from 'src/assets/icons/svg';
import { getBlock, selectBlock, selectBlockError, selectBlockLoading } from '../store/blockSlice';
import AddressLink from '../component/AddressLink';
import TxItem from '../component/TxItem';
import SubCardItem from '../component/SubCardItem';
import TickStatus from '../component/TickStatus';
import HomeLink from '../component/HomeLink';

function TickPage() {
  const theme = useTheme();
  const { t } = useTranslation('networkPage');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tick } = useParams();
  const block = useSelector(selectBlock);
  const isLoading = useSelector(selectBlockLoading);
  const error = useSelector(selectBlockError);
  const [selectedTx, setSelectedTx] = useState([]);
  const [displayTransactions, setDisplayTransactions] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const batchSize = 5;
  const scrollRef = useRef(null);
  const [option, setOption] = useState('all');
  const nonExecutedTxIds = useMemo(() => {
    return _.differenceBy(block?.transferTx || [], block?.approvedTx || [], 'txId').map(
      (item) => item.txId
    );
  }, [block]);

  const handleChange = (event) => {
    setOption(event.target.value);
  };

  useEffect(() => {
    dispatch(getBlock(tick));
  }, [tick, dispatch]);

  useEffect(() => {
    if (block && block.tx) {
      setDisplayTransactions([]);
      setDisplayTransactions((selectedTx || []).slice(0, batchSize));
      setHasMore(selectedTx.length > batchSize);
    }
  }, [block, selectedTx]);

  const loadMoreTransactions = () => {
    if (displayTransactions.length < selectedTx.length) {
      const nextTransactions = selectedTx.slice(
        displayTransactions.length,
        displayTransactions.length + batchSize
      );

      setDisplayTransactions((prevTransactions) => [...prevTransactions, ...nextTransactions]);
      setHasMore(displayTransactions.length + batchSize < selectedTx.length);
    } else {
      setHasMore(false);
    }
  };

  useEffect(() => {
    if (option === 'all') {
      setSelectedTx(block?.tx || []);
    } else if (option === 'transfer') {
      setSelectedTx(block?.transferTx || []);
    } else {
      setSelectedTx(block?.approvedTx || []);
    }
  }, [option, block]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    const handleScroll = () => {
      if (scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight) {
        console.log('');
      }
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full absolute">
        <LinearProgress />
      </div>
    );
  }

  console.log(block);

  return (
    <div
      className="w-full max-h-[calc(100vh-76px)] overflow-y-auto"
      id="scrollableDiv"
      ref={scrollRef}
    >
      <div className="py-32 max-w-[960px] mx-auto px-12">
        <Breadcrumbs aria-label="breadcrumb">
          <HomeLink />
          <Typography className="text-12 text-primary-40">
            {t('tick')} {formatString(tick)}
          </Typography>
        </Breadcrumbs>
        <div className="flex justify-between gap-12 items-center mt-24 mb-36">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-8">
              <IconButton onClick={() => navigate(`/network/tick/${Number(tick) - 1}`)}>
                <img
                  className="w-24 h-24"
                  src={`assets/icons/arrow-${theme.direction === 'rtl' ? 'right' : 'left'}.svg`}
                  alt="icon"
                />
              </IconButton>
              <Typography className="text-32 leading-40 font-500 font-space">
                {formatString(tick)}
              </Typography>
              <IconButton onClick={() => navigate(`/network/tick/${Number(tick) + 1}`)}>
                <img
                  className="w-24 h-24"
                  src={`assets/icons/arrow-${theme.direction === 'rtl' ? 'left' : 'right'}.svg`}
                  alt="icon"
                />
              </IconButton>
            </div>
            {!error && (
              <Typography className="text-14 leading-20 font-space text-gray-50">
                {formatDate(block?.tick.timestamp)}
              </Typography>
            )}
          </div>
          <div className="hidden md:block">
            <TickStatus dataStatus={!error ? block?.tick : null} />
          </div>
        </div>
        {!error && (
          <div className="mb-24">
            <SubCardItem
              title={t('signature')}
              content={
                <Typography className="text-14 leading-20 font-space text-gray-50 break-all">
                  {formatBase64(block?.tick.signatureHex)}
                </Typography>
              }
            />
            <SubCardItem
              title={t('tickLeader')}
              content={
                <AddressLink
                  value={block?.epoch.identities[+block?.tick.computorIndex]}
                  tickValue={tick}
                  copy
                />
              }
            />
          </div>
        )}
        <div className="mb-24 md:hidden">
          <TickStatus dataStatus={!error ? block?.tick : null} />
        </div>
        {!error && (
          <div className="flex flex-col gap-16">
            <div className="flex justify-between items-center">
              <Typography className="text-20 leading-26 font-500 font-space">
                {t('transactions')}
              </Typography>
              <Select
                value={option}
                onChange={handleChange}
                className="border-gray-70 bg-gray-80 rounded-8 focus:border-gray-60"
                IconComponent={ArrowIcon}
                sx={{
                  minWidth: 225,
                  '&.Mui-focused fieldset': {
                    borderColor: '#4B5565 !important', // Your desired border color
                  },
                }}
              >
                {transactionOptions.map((item) => (
                  <MenuItem className="py-10 min-w-[164px]" key={item.id} value={item.id}>
                    <Typography className="text-16 leading-20 font-space">{item.title}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </div>
            <InfiniteScroll
              dataLength={displayTransactions.length}
              next={loadMoreTransactions}
              hasMore={hasMore}
              scrollableTarget="scrollableDiv"
              loader={
                <Typography className="text-14 text-primary-50 font-bold py-10 text-center">
                  Loading...
                </Typography>
              }
              endMessage={
                displayTransactions.length === 0 ? (
                  <Typography className="text-14 font-bold py-10 text-center">
                    There are no transactions
                  </Typography>
                ) : (
                  <Typography className="text-14 font-bold py-10 text-center">
                    You have seen all transactions
                  </Typography>
                )
              }
            >
              <div className="flex flex-col gap-12">
                {displayTransactions.map((item, index) => (
                  <TxItem key={index} {...item} nonExecutedTxIds={nonExecutedTxIds} />
                ))}
              </div>
            </InfiniteScroll>
          </div>
        )}
      </div>
    </div>
  );
}

export default TickPage;
