import { Box, Button, makeStyles, Theme, Typography } from '@material-ui/core';
import { arrayMoveImmutable } from 'array-move';
import React, { useEffect, useState, useRef } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

/**
 * Style for component
 */
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  containerBox: {
    display: 'grid',

    minWidth: 500,
    margin: 'auto',
    boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    [theme.breakpoints.down(426)]: {
      minWidth: 350,
    },
    [theme.breakpoints.down(321)]: {
      minWidth: 300,
    },
  },
  box: {
    display: 'inline-block',
    width: '100%',
    height: 65,
    border: '1px solid #000000',
    cursor: 'pointer',
    color: '#000',
    textAlign: 'center',
    lineHeight: '65px',
    fontSize: 13,
    background: 'white',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    [theme.breakpoints.down(426)]: {
      height: 45,
      lineHeight: 45,
    },
    [theme.breakpoints.down(321)]: {
      height: 39,
      lineHeight: 39,
    },
  },
  boxColor: {
    minWidth: 500,
    margin: 'auto',
    textAlign: 'center',
    '& > p': {
      textAlign: 'center',
      fontSize: 24,
      fontWeight: 'bold',
    },
    [theme.breakpoints.down(426)]: {
      width: 350,
    },
    [theme.breakpoints.down(321)]: {
      width: 300,
    },
  },
  description: {
    display: 'block',
    marginBottom: 15,
  },
  form: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inputForm: {
    border: 'none',
    borderBottom: '1px solid #000',
    '&:focus': {
      outline: 'none',
    },
  },
}));

export interface DragAndDropProps {}

export default function DragAndDrop(props: DragAndDropProps) {

  const classes = useStyles();
  const rowInput:any = useRef();
  const columnInput:any = useRef();

  const [data, setData] = useState<number[]>([]);
  const [config, setConfig] = useState<any>({
    rows: 0,
    columns: 0,
  });

  useEffect(() => {

    // Init data
    zigZag(5, 5);

  }, []);

  /**
   * Generate zigzag pattern
   * @param rows
   * @param columns
   */
  const zigZag = (rows: number, columns: number) => {

    if (rows === 0 || columns === 0) return;

    setConfig({
      rows: rows,
      columns: columns,
    });

    const arr: any = Array.from({ length: rows * columns }, (_, i) => i + 1);

    let arrGroupRow: any = [];

    while (arr.length > 0) {
      arrGroupRow.push(arr.splice(0, rows));
    }

    const arrGroupRowReverse = arrGroupRow.map((el, i) => (i % 2 === 0 ? el : el.reverse()));

    const output = arrGroupRowReverse[0].map((_: number, colIndex) =>
      arrGroupRowReverse.map((row: number) => row[colIndex])
    );

    setData(output.join().split(','));

  };

  /**
   *  sort again data when change position of index
   */
  const onSortEnd = ({ oldIndex, newIndex }: any) => {

    setData(arrayMoveImmutable(data, oldIndex, newIndex));

  };

  const SortableItem = SortableElement(({ value }: any) => {

    return <Box className={classes.box}>{value}</Box>;

  });

  /**
   * Render list item
   */
  const SortableList = SortableContainer(({ items }: any) => {

    return (
      <Box
        className={classes.containerBox}
        style={{ gridTemplateColumns: `repeat(${config.columns}, 1fr)` }}
      >
        {items.map((value: any, index: any) => (
          <SortableItem key={`item-${index}`} index={index} value={value} />
        ))}
      </Box>
    );

  });

  /**
   * Submit form
   */
  const handleSubmit = (e) => {

    e.preventDefault();

    if (!rowInput.current.value || !columnInput.current.value) return;

    zigZag(Number(rowInput.current.value), Number(columnInput.current.value));

  };

  return (
    <Box className={classes.root}>
      <Box className={classes.boxColor}>
        <Typography>Table random zigzag </Typography>
        <Typography className={classes.description} component='span'>
          Please input rows & columns to display table!
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <input ref={rowInput} className={classes.inputForm} id='rows' />

          <input ref={columnInput} className={classes.inputForm} id='columns' />

          <Button type='submit' variant='contained' color='primary'>
            Generate
          </Button>
        </form>
        <SortableList items={data} onSortEnd={onSortEnd} axis={'xy'} />
      </Box>
    </Box>
  );
}
