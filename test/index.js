/*
* @Author: lushijie
* @Date:   2017-03-22 21:00:08
* @Last Modified by:   lushijie
* @Last Modified time: 2017-04-01 11:40:51
*/

import test from 'ava';
import helper from 'think-helper';
import path from 'path';
import fs from 'fs';
import Redis from '../index';

test.serial('set key & get key & del key', async t => {
  let key = 'name1';
  let value = 'thinkjs';
  let redisInst = new Redis();
  redisInst.on('connect', function() {
    // console.log('connect...')
  });
  let s = await redisInst.set(key, value);
  let g1 = await redisInst.get(key);
  let d = await redisInst.delete(key);
  let g2 = await redisInst.get(key);

  t.true(s === 'OK' && g1 === value && d === 1 && g2 === null);
});

test.serial('set key', async t => {
  let redisInst = new Redis();
  let s1 = await redisInst.set('name2', 'lushijie');
  let s2 = await redisInst.set('name3', 'lushijie', 3000);
  let s3 = await redisInst.set('name4', 'lushijie', 'EX', 5);
  let s4 = await redisInst.set('name5', 'lushijie', 'PX', 10000);
  redisInst.close();
  redisInst.close();

  t.true(s1 === 'OK' && s2 === 'OK' && s3 === 'OK' && s4 === 'OK');
});


test.serial('set key and then incr & decr ', async t => {
  let key = 'id';
  let redisInst = new Redis();
  let s1 = await redisInst.set(key, '100', 365 * 24 * 3600);
  await redisInst.increase(key).catch((e) => {
    console.log(e);
  });
  let g1 = await redisInst.get(key);

  await redisInst.decrease(key).catch((e) => {
    console.log(e);
  });
  let g2 = await redisInst.get(key);
  t.true(g1 === '101' && g2 === '100');
});

test.serial('clear keys', async t => {
  const keys = 'na*';
  const redisInst = new Redis();
  const s = await redisInst.set('name2', 'lushijie');
  const g1 = await redisInst.get('name2');
  const result = await redisInst.deleteRegKey(keys);
  const g2 = await redisInst.get('name2');
  t.true(
    g1 === 'lushijie' && g2 === null && result === 'OK'
  );
});
