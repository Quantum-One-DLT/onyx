# Solidity API

## DeFiOneV1Factory

Deploys DeFiOne V1 pools and manages ownership and control over pool protocol fees

### Contract
DeFiOneV1Factory : contracts/contracts/DeFiOneV1Factory.sol

 --- 
### Functions:
### constructor

```solidity
constructor() public
```

### createPool

```solidity
function createPool(address tokenA, address tokenB, uint24 fee) external returns (address pool)
```

Creates a pool for the given two tokens and fee

_tokenA and tokenB may be passed in either order: token0/token1 or token1/token0. tickSpacing is retrieved
from the fee. The call will revert if the pool already exists, the fee is invalid, or the token arguments
are invalid._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenA | address | One of the two tokens in the desired pool |
| tokenB | address | The other of the two tokens in the desired pool |
| fee | uint24 | The desired fee for the pool |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| pool | address | The address of the newly created pool |

### setOwner

```solidity
function setOwner(address _owner) external
```

Updates the owner of the factory

_Must be called by the current owner_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _owner | address | The new owner of the factory |

### enableFeeAmount

```solidity
function enableFeeAmount(uint24 fee, int24 tickSpacing) public
```

Enables a fee amount with the given tickSpacing

_Fee amounts may never be removed once enabled_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| fee | uint24 | The fee amount to enable, denominated in hundredths of a bip (i.e. 1e-6) |
| tickSpacing | int24 | The spacing between ticks to be enforced for all pools created with the given fee amount |

inherits NoDelegateCall:
inherits DeFiOneV1PoolDeployer:
### deploy

```solidity
function deploy(address factory, address token0, address token1, uint24 fee, int24 tickSpacing) internal returns (address pool)
```

_Deploys a pool with the given parameters by transiently setting the parameters storage slot and then
clearing it after deploying the pool._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| factory | address | The contract address of the DeFiOne V1 factory |
| token0 | address | The first token of the pool by address sort order |
| token1 | address | The second token of the pool by address sort order |
| fee | uint24 | The fee collected upon every swap in the pool, denominated in hundredths of a bip |
| tickSpacing | int24 | The spacing between usable ticks |

inherits IDeFiOneV1PoolDeployer:
### parameters

```solidity
function parameters() external view returns (address factory, address token0, address token1, uint24 fee, int24 tickSpacing)
```

Get the parameters to be used in constructing the pool, set transiently during pool creation.

_Called by the pool constructor to fetch the parameters of the pool
Returns factory The factory address
Returns token0 The first token of the pool by address sort order
Returns token1 The second token of the pool by address sort order
Returns fee The fee collected upon every swap in the pool, denominated in hundredths of a bip
Returns tickSpacing The minimum number of ticks between initialized ticks_

inherits IDeFiOneV1Factory:
### owner

```solidity
function owner() external view returns (address)
```

Returns the current owner of the factory

_Can be changed by the current owner via setOwner_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | The address of the factory owner |

### feeAmountTickSpacing

```solidity
function feeAmountTickSpacing(uint24 fee) external view returns (int24)
```

Returns the tick spacing for a given fee amount, if enabled, or 0 if not enabled

_A fee amount can never be removed, so this value should be hard coded or cached in the calling context_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| fee | uint24 | The enabled fee, denominated in hundredths of a bip. Returns 0 in case of unenabled fee |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | int24 | The tick spacing |

### getPool

```solidity
function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)
```

Returns the pool address for a given pair of tokens and a fee, or address 0 if it does not exist

_tokenA and tokenB may be passed in either token0/token1 or token1/token0 order_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenA | address | The contract address of either token0 or token1 |
| tokenB | address | The contract address of the other token |
| fee | uint24 | The fee collected upon every swap in the pool, denominated in hundredths of a bip |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| pool | address | The pool address |

 --- 
### Events:
inherits NoDelegateCall:
inherits DeFiOneV1PoolDeployer:
inherits IDeFiOneV1PoolDeployer:
inherits IDeFiOneV1Factory:
### OwnerChanged

```solidity
event OwnerChanged(address oldOwner, address newOwner)
```

Emitted when the owner of the factory is changed

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| oldOwner | address | The owner before the owner was changed |
| newOwner | address | The owner after the owner was changed |

### PoolCreated

```solidity
event PoolCreated(address token0, address token1, uint24 fee, int24 tickSpacing, address pool)
```

Emitted when a pool is created

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token0 | address | The first token of the pool by address sort order |
| token1 | address | The second token of the pool by address sort order |
| fee | uint24 | The fee collected upon every swap in the pool, denominated in hundredths of a bip |
| tickSpacing | int24 | The minimum number of ticks between initialized ticks |
| pool | address | The address of the created pool |

### FeeAmountEnabled

```solidity
event FeeAmountEnabled(uint24 fee, int24 tickSpacing)
```

Emitted when a new fee amount is enabled for pool creation via the factory

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| fee | uint24 | The enabled fee, denominated in hundredths of a bip |
| tickSpacing | int24 | The minimum number of ticks between initialized ticks for pools created with the given fee |

## DeFiOneV1Pool

### Contract
DeFiOneV1Pool : contracts/contracts/DeFiOneV1Pool.sol

 --- 
### Modifiers:
### lock

```solidity
modifier lock()
```

_Mutually exclusive reentrancy protection into the pool to/from a method. This method also prevents entrance
to a function before the pool is initialized. The reentrancy guard is required throughout the contract because
we use balance checks to determine the payment status of interactions such as mint, swap and flash._

### onlyFactoryOwner

```solidity
modifier onlyFactoryOwner()
```

_Prevents calling a function from anyone except the address returned by IDeFiOneV1Factory#owner()_

 --- 
### Functions:
### constructor

```solidity
constructor() public
```

### _blockTimestamp

```solidity
function _blockTimestamp() internal view virtual returns (uint32)
```

_Returns the block timestamp truncated to 32 bits, i.e. mod 2**32. This method is overridden in tests._

### snapshotCumulativesInside

```solidity
function snapshotCumulativesInside(int24 tickLower, int24 tickUpper) external view returns (int56 tickCumulativeInside, uint160 secondsPerLiquidityInsideX128, uint32 secondsInside)
```

Returns a snapshot of the tick cumulative, seconds per liquidity and seconds inside a tick range

_Snapshots must only be compared to other snapshots, taken over a period for which a position existed.
I.e., snapshots cannot be compared if a position is not held for the entire period between when the first
snapshot is taken and the second snapshot is taken._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tickLower | int24 | The lower tick of the range |
| tickUpper | int24 | The upper tick of the range |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| tickCumulativeInside | int56 | The snapshot of the tick accumulator for the range |
| secondsPerLiquidityInsideX128 | uint160 | The snapshot of seconds per liquidity for the range |
| secondsInside | uint32 | The snapshot of seconds per liquidity for the range |

### observe

```solidity
function observe(uint32[] secondsAgos) external view returns (int56[] tickCumulatives, uint160[] secondsPerLiquidityCumulativeX128s)
```

Returns the cumulative tick and liquidity as of each timestamp `secondsAgo` from the current block timestamp

_To get a time weighted average tick or liquidity-in-range, you must call this with two values, one representing
the beginning of the period and another for the end of the period. E.g., to get the last hour time-weighted average tick,
you must call it with secondsAgos = [3600, 0].
The time weighted average tick represents the geometric time weighted average price of the pool, in
log base sqrt(1.0001) of token1 / token0. The TickMath library can be used to go from a tick value to a ratio._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| secondsAgos | uint32[] | From how long ago each cumulative tick and liquidity value should be returned |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| tickCumulatives | int56[] | Cumulative tick values as of each `secondsAgos` from the current block timestamp |
| secondsPerLiquidityCumulativeX128s | uint160[] | Cumulative seconds per liquidity-in-range value as of each `secondsAgos` from the current block timestamp |

### increaseObservationCardinalityNext

```solidity
function increaseObservationCardinalityNext(uint16 observationCardinalityNext) external
```

Increase the maximum number of price and liquidity observations that this pool will store

_This method is no-op if the pool already has an observationCardinalityNext greater than or equal to
the input observationCardinalityNext._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| observationCardinalityNext | uint16 | The desired minimum number of observations for the pool to store |

### initialize

```solidity
function initialize(uint160 sqrtPriceX96) external
```

Sets the initial price for the pool

_not locked because it initializes unlocked_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sqrtPriceX96 | uint160 | the initial sqrt price of the pool as a Q64.96 |

### mint

```solidity
function mint(address recipient, int24 tickLower, int24 tickUpper, uint128 amount, bytes data) external returns (uint256 amount0, uint256 amount1)
```

Adds liquidity for the given recipient/tickLower/tickUpper position

_noDelegateCall is applied indirectly via _modifyPosition_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipient | address | The address for which the liquidity will be created |
| tickLower | int24 | The lower tick of the position in which to add liquidity |
| tickUpper | int24 | The upper tick of the position in which to add liquidity |
| amount | uint128 | The amount of liquidity to mint |
| data | bytes | Any data that should be passed through to the callback |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount0 | uint256 | The amount of token0 that was paid to mint the given amount of liquidity. Matches the value in the callback |
| amount1 | uint256 | The amount of token1 that was paid to mint the given amount of liquidity. Matches the value in the callback |

### collect

```solidity
function collect(address recipient, int24 tickLower, int24 tickUpper, uint128 amount0Requested, uint128 amount1Requested) external returns (uint128 amount0, uint128 amount1)
```

Collects tokens owed to a position

_Does not recompute fees earned, which must be done either via mint or burn of any amount of liquidity.
Collect must be called by the position owner. To withdraw only token0 or only token1, amount0Requested or
amount1Requested may be set to zero. To withdraw all tokens owed, caller may pass any value greater than the
actual tokens owed, e.g. type(uint128).max. Tokens owed may be from accumulated swap fees or burned liquidity._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipient | address | The address which should receive the fees collected |
| tickLower | int24 | The lower tick of the position for which to collect fees |
| tickUpper | int24 | The upper tick of the position for which to collect fees |
| amount0Requested | uint128 | How much token0 should be withdrawn from the fees owed |
| amount1Requested | uint128 | How much token1 should be withdrawn from the fees owed |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount0 | uint128 | The amount of fees collected in token0 |
| amount1 | uint128 | The amount of fees collected in token1 |

### burn

```solidity
function burn(int24 tickLower, int24 tickUpper, uint128 amount) external returns (uint256 amount0, uint256 amount1)
```

Burn liquidity from the sender and account tokens owed for the liquidity to the position

_noDelegateCall is applied indirectly via _modifyPosition_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tickLower | int24 | The lower tick of the position for which to burn liquidity |
| tickUpper | int24 | The upper tick of the position for which to burn liquidity |
| amount | uint128 | How much liquidity to burn |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount0 | uint256 | The amount of token0 sent to the recipient |
| amount1 | uint256 | The amount of token1 sent to the recipient |

### swap

```solidity
function swap(address recipient, bool zeroForOne, int256 amountSpecified, uint160 sqrtPriceLimitX96, bytes data) external returns (int256 amount0, int256 amount1)
```

Swap token0 for token1, or token1 for token0

_The caller of this method receives a callback in the form of IDeFiOneV1SwapCallback#defioneV1SwapCallback_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipient | address | The address to receive the output of the swap |
| zeroForOne | bool | The direction of the swap, true for token0 to token1, false for token1 to token0 |
| amountSpecified | int256 | The amount of the swap, which implicitly configures the swap as exact input (positive), or exact output (negative) |
| sqrtPriceLimitX96 | uint160 | The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap |
| data | bytes | Any data to be passed through to the callback |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount0 | int256 | The delta of the balance of token0 of the pool, exact when negative, minimum when positive |
| amount1 | int256 | The delta of the balance of token1 of the pool, exact when negative, minimum when positive |

### flash

```solidity
function flash(address recipient, uint256 amount0, uint256 amount1, bytes data) external
```

Receive token0 and/or token1 and pay it back, plus a fee, in the callback

_The caller of this method receives a callback in the form of IDeFiOneV1FlashCallback#defioneV1FlashCallback
Can be used to donate underlying tokens pro-rata to currently in-range liquidity providers by calling
with 0 amount{0,1} and sending the donation amount(s) from the callback_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipient | address | The address which will receive the token0 and token1 amounts |
| amount0 | uint256 | The amount of token0 to send |
| amount1 | uint256 | The amount of token1 to send |
| data | bytes | Any data to be passed through to the callback |

### setFeeProtocol

```solidity
function setFeeProtocol(uint8 feeProtocol0, uint8 feeProtocol1) external
```

Set the denominator of the protocol's % share of the fees

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| feeProtocol0 | uint8 | new protocol fee for token0 of the pool |
| feeProtocol1 | uint8 | new protocol fee for token1 of the pool |

### collectProtocol

```solidity
function collectProtocol(address recipient, uint128 amount0Requested, uint128 amount1Requested) external returns (uint128 amount0, uint128 amount1)
```

Collect the protocol fee accrued to the pool

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipient | address | The address to which collected protocol fees should be sent |
| amount0Requested | uint128 | The maximum amount of token0 to send, can be 0 to collect fees in only token1 |
| amount1Requested | uint128 | The maximum amount of token1 to send, can be 0 to collect fees in only token0 |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount0 | uint128 | The protocol fee collected in token0 |
| amount1 | uint128 | The protocol fee collected in token1 |

inherits NoDelegateCall:
inherits IDeFiOneV1Pool:
inherits IDeFiOneV1PoolEvents:
inherits IDeFiOneV1PoolOwnerActions:
inherits IDeFiOneV1PoolActions:
inherits IDeFiOneV1PoolDerivedState:
inherits IDeFiOneV1PoolState:
### slot0

```solidity
function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)
```

The 0th storage slot in the pool stores many values, and is exposed as a single method to save gas
when accessed externally.

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| sqrtPriceX96 | uint160 | The current price of the pool as a sqrt(token1/token0) Q64.96 value tick The current tick of the pool, i.e. according to the last tick transition that was run. This value may not always be equal to SqrtTickMath.getTickAtSqrtRatio(sqrtPriceX96) if the price is on a tick boundary. observationIndex The index of the last oracle observation that was written, observationCardinality The current maximum number of observations stored in the pool, observationCardinalityNext The next maximum number of observations, to be updated when the observation. feeProtocol The protocol fee for both tokens of the pool. Encoded as two 4 bit values, where the protocol fee of token1 is shifted 4 bits and the protocol fee of token0 is the lower 4 bits. Used as the denominator of a fraction of the swap fee, e.g. 4 means 1/4th of the swap fee. unlocked Whether the pool is currently locked to reentrancy |
| tick | int24 |  |
| observationIndex | uint16 |  |
| observationCardinality | uint16 |  |
| observationCardinalityNext | uint16 |  |
| feeProtocol | uint8 |  |
| unlocked | bool |  |

### feeGrowthGlobal0X128

```solidity
function feeGrowthGlobal0X128() external view returns (uint256)
```

The fee growth as a Q128.128 fees of token0 collected per unit of liquidity for the entire life of the pool

_This value can overflow the uint256_

### feeGrowthGlobal1X128

```solidity
function feeGrowthGlobal1X128() external view returns (uint256)
```

The fee growth as a Q128.128 fees of token1 collected per unit of liquidity for the entire life of the pool

_This value can overflow the uint256_

### protocolFees

```solidity
function protocolFees() external view returns (uint128 token0, uint128 token1)
```

The amounts of token0 and token1 that are owed to the protocol

_Protocol fees will never exceed uint128 max in either token_

### liquidity

```solidity
function liquidity() external view returns (uint128)
```

The currently in range liquidity available to the pool

_This value has no relationship to the total liquidity across all ticks_

### ticks

```solidity
function ticks(int24 tick) external view returns (uint128 liquidityGross, int128 liquidityNet, uint256 feeGrowthOutside0X128, uint256 feeGrowthOutside1X128, int56 tickCumulativeOutside, uint160 secondsPerLiquidityOutsideX128, uint32 secondsOutside, bool initialized)
```

Look up information about a specific tick in the pool

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tick | int24 | The tick to look up |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| liquidityGross | uint128 | the total amount of position liquidity that uses the pool either as tick lower or tick upper, liquidityNet how much liquidity changes when the pool price crosses the tick, feeGrowthOutside0X128 the fee growth on the other side of the tick from the current tick in token0, feeGrowthOutside1X128 the fee growth on the other side of the tick from the current tick in token1, tickCumulativeOutside the cumulative tick value on the other side of the tick from the current tick secondsPerLiquidityOutsideX128 the seconds spent per liquidity on the other side of the tick from the current tick, secondsOutside the seconds spent on the other side of the tick from the current tick, initialized Set to true if the tick is initialized, i.e. liquidityGross is greater than 0, otherwise equal to false. Outside values can only be used if the tick is initialized, i.e. if liquidityGross is greater than 0. In addition, these values are only relative and must be used only in comparison to previous snapshots for a specific position. |
| liquidityNet | int128 |  |
| feeGrowthOutside0X128 | uint256 |  |
| feeGrowthOutside1X128 | uint256 |  |
| tickCumulativeOutside | int56 |  |
| secondsPerLiquidityOutsideX128 | uint160 |  |
| secondsOutside | uint32 |  |
| initialized | bool |  |

### tickBitmap

```solidity
function tickBitmap(int16 wordPosition) external view returns (uint256)
```

Returns 256 packed tick initialized boolean values. See TickBitmap for more information

### positions

```solidity
function positions(bytes32 key) external view returns (uint128 _liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)
```

Returns the information about a position by the position's key

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| key | bytes32 | The position's key is a hash of a preimage composed by the owner, tickLower and tickUpper |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| _liquidity | uint128 | The amount of liquidity in the position, Returns feeGrowthInside0LastX128 fee growth of token0 inside the tick range as of the last mint/burn/poke, Returns feeGrowthInside1LastX128 fee growth of token1 inside the tick range as of the last mint/burn/poke, Returns tokensOwed0 the computed amount of token0 owed to the position as of the last mint/burn/poke, Returns tokensOwed1 the computed amount of token1 owed to the position as of the last mint/burn/poke |
| feeGrowthInside0LastX128 | uint256 |  |
| feeGrowthInside1LastX128 | uint256 |  |
| tokensOwed0 | uint128 |  |
| tokensOwed1 | uint128 |  |

### observations

```solidity
function observations(uint256 index) external view returns (uint32 blockTimestamp, int56 tickCumulative, uint160 secondsPerLiquidityCumulativeX128, bool initialized)
```

Returns data about a specific observation index

_You most likely want to use #observe() instead of this method to get an observation as of some amount of time
ago, rather than at a specific index in the array._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| index | uint256 | The element of the observations array to fetch |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| blockTimestamp | uint32 | The timestamp of the observation, Returns tickCumulative the tick multiplied by seconds elapsed for the life of the pool as of the observation timestamp, Returns secondsPerLiquidityCumulativeX128 the seconds per in range liquidity for the life of the pool as of the observation timestamp, Returns initialized whether the observation has been initialized and the values are safe to use |
| tickCumulative | int56 |  |
| secondsPerLiquidityCumulativeX128 | uint160 |  |
| initialized | bool |  |

inherits IDeFiOneV1PoolImmutables:
### factory

```solidity
function factory() external view returns (address)
```

The contract that deployed the pool, which must adhere to the IDeFiOneV1Factory interface

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | The contract address |

### token0

```solidity
function token0() external view returns (address)
```

The first of the two tokens of the pool, sorted by address

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | The token contract address |

### token1

```solidity
function token1() external view returns (address)
```

The second of the two tokens of the pool, sorted by address

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | The token contract address |

### fee

```solidity
function fee() external view returns (uint24)
```

The pool's fee in hundredths of a bip, i.e. 1e-6

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint24 | The fee |

### tickSpacing

```solidity
function tickSpacing() external view returns (int24)
```

The pool tick spacing

_Ticks can only be used at multiples of this value, minimum of 1 and always positive
e.g.: a tickSpacing of 3 means ticks can be initialized every 3rd tick, i.e., ..., -6, -3, 0, 3, 6, ...
This value is an int24 to avoid casting even though it is always positive._

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | int24 | The tick spacing |

### maxLiquidityPerTick

```solidity
function maxLiquidityPerTick() external view returns (uint128)
```

The maximum amount of position liquidity that can use any tick in the range

_This parameter is enforced per tick to prevent liquidity from overflowing a uint128 at any point, and
also prevents out-of-range liquidity from being used to prevent adding in-range liquidity to a pool_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint128 | The max amount of liquidity per tick |

 --- 
### Events:
inherits NoDelegateCall:
inherits IDeFiOneV1Pool:
inherits IDeFiOneV1PoolEvents:
### Initialize

```solidity
event Initialize(uint160 sqrtPriceX96, int24 tick)
```

Emitted exactly once by a pool when #initialize is first called on the pool

_Mint/Burn/Swap cannot be emitted by the pool before Initialize_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sqrtPriceX96 | uint160 | The initial sqrt price of the pool, as a Q64.96 |
| tick | int24 | The initial tick of the pool, i.e. log base 1.0001 of the starting price of the pool |

### Mint

```solidity
event Mint(address sender, address owner, int24 tickLower, int24 tickUpper, uint128 amount, uint256 amount0, uint256 amount1)
```

Emitted when liquidity is minted for a given position

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sender | address | The address that minted the liquidity |
| owner | address | The owner of the position and recipient of any minted liquidity |
| tickLower | int24 | The lower tick of the position |
| tickUpper | int24 | The upper tick of the position |
| amount | uint128 | The amount of liquidity minted to the position range |
| amount0 | uint256 | How much token0 was required for the minted liquidity |
| amount1 | uint256 | How much token1 was required for the minted liquidity |

### Collect

```solidity
event Collect(address owner, address recipient, int24 tickLower, int24 tickUpper, uint128 amount0, uint128 amount1)
```

Emitted when fees are collected by the owner of a position

_Collect events may be emitted with zero amount0 and amount1 when the caller chooses not to collect fees_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | The owner of the position for which fees are collected |
| recipient | address |  |
| tickLower | int24 | The lower tick of the position |
| tickUpper | int24 | The upper tick of the position |
| amount0 | uint128 | The amount of token0 fees collected |
| amount1 | uint128 | The amount of token1 fees collected |

### Burn

```solidity
event Burn(address owner, int24 tickLower, int24 tickUpper, uint128 amount, uint256 amount0, uint256 amount1)
```

Emitted when a position's liquidity is removed

_Does not withdraw any fees earned by the liquidity position, which must be withdrawn via #collect_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | The owner of the position for which liquidity is removed |
| tickLower | int24 | The lower tick of the position |
| tickUpper | int24 | The upper tick of the position |
| amount | uint128 | The amount of liquidity to remove |
| amount0 | uint256 | The amount of token0 withdrawn |
| amount1 | uint256 | The amount of token1 withdrawn |

### Swap

```solidity
event Swap(address sender, address recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)
```

Emitted by the pool for any swaps between token0 and token1

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sender | address | The address that initiated the swap call, and that received the callback |
| recipient | address | The address that received the output of the swap |
| amount0 | int256 | The delta of the token0 balance of the pool |
| amount1 | int256 | The delta of the token1 balance of the pool |
| sqrtPriceX96 | uint160 | The sqrt(price) of the pool after the swap, as a Q64.96 |
| liquidity | uint128 | The liquidity of the pool after the swap |
| tick | int24 | The log base 1.0001 of price of the pool after the swap |

### Flash

```solidity
event Flash(address sender, address recipient, uint256 amount0, uint256 amount1, uint256 paid0, uint256 paid1)
```

Emitted by the pool for any flashes of token0/token1

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sender | address | The address that initiated the swap call, and that received the callback |
| recipient | address | The address that received the tokens from flash |
| amount0 | uint256 | The amount of token0 that was flashed |
| amount1 | uint256 | The amount of token1 that was flashed |
| paid0 | uint256 | The amount of token0 paid for the flash, which can exceed the amount0 plus the fee |
| paid1 | uint256 | The amount of token1 paid for the flash, which can exceed the amount1 plus the fee |

### IncreaseObservationCardinalityNext

```solidity
event IncreaseObservationCardinalityNext(uint16 observationCardinalityNextOld, uint16 observationCardinalityNextNew)
```

Emitted by the pool for increases to the number of observations that can be stored

_observationCardinalityNext is not the observation cardinality until an observation is written at the index
just before a mint/swap/burn._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| observationCardinalityNextOld | uint16 | The previous value of the next observation cardinality |
| observationCardinalityNextNew | uint16 | The updated value of the next observation cardinality |

### SetFeeProtocol

```solidity
event SetFeeProtocol(uint8 feeProtocol0Old, uint8 feeProtocol1Old, uint8 feeProtocol0New, uint8 feeProtocol1New)
```

Emitted when the protocol fee is changed by the pool

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| feeProtocol0Old | uint8 | The previous value of the token0 protocol fee |
| feeProtocol1Old | uint8 | The previous value of the token1 protocol fee |
| feeProtocol0New | uint8 | The updated value of the token0 protocol fee |
| feeProtocol1New | uint8 | The updated value of the token1 protocol fee |

### CollectProtocol

```solidity
event CollectProtocol(address sender, address recipient, uint128 amount0, uint128 amount1)
```

Emitted when the collected protocol fees are withdrawn by the factory owner

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sender | address | The address that collects the protocol fees |
| recipient | address | The address that receives the collected protocol fees |
| amount0 | uint128 | The amount of token0 protocol fees that is withdrawn |
| amount1 | uint128 |  |

inherits IDeFiOneV1PoolOwnerActions:
inherits IDeFiOneV1PoolActions:
inherits IDeFiOneV1PoolDerivedState:
inherits IDeFiOneV1PoolState:
inherits IDeFiOneV1PoolImmutables:

## DeFiOneV1PoolDeployer

### Contract
DeFiOneV1PoolDeployer : contracts/contracts/DeFiOneV1PoolDeployer.sol

 --- 
### Functions:
### deploy

```solidity
function deploy(address factory, address token0, address token1, uint24 fee, int24 tickSpacing) internal returns (address pool)
```

_Deploys a pool with the given parameters by transiently setting the parameters storage slot and then
clearing it after deploying the pool._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| factory | address | The contract address of the DeFiOne V1 factory |
| token0 | address | The first token of the pool by address sort order |
| token1 | address | The second token of the pool by address sort order |
| fee | uint24 | The fee collected upon every swap in the pool, denominated in hundredths of a bip |
| tickSpacing | int24 | The spacing between usable ticks |

inherits IDeFiOneV1PoolDeployer:
### parameters

```solidity
function parameters() external view returns (address factory, address token0, address token1, uint24 fee, int24 tickSpacing)
```

Get the parameters to be used in constructing the pool, set transiently during pool creation.

_Called by the pool constructor to fetch the parameters of the pool
Returns factory The factory address
Returns token0 The first token of the pool by address sort order
Returns token1 The second token of the pool by address sort order
Returns fee The fee collected upon every swap in the pool, denominated in hundredths of a bip
Returns tickSpacing The minimum number of ticks between initialized ticks_

## NoDelegateCall

Base contract that provides a modifier for preventing delegatecall to methods in a child contract

### Contract
NoDelegateCall : contracts/contracts/NoDelegateCall.sol

 --- 
### Modifiers:
### noDelegateCall

```solidity
modifier noDelegateCall()
```

Prevents delegatecall into the modified method

 --- 
### Functions:
### constructor

```solidity
constructor() internal
```

## IDeFiOneV1Factory

The DeFiOne V1 Factory facilitates creation of DeFiOne V1 pools and control over the protocol fees

### Contract
IDeFiOneV1Factory : contracts/contracts/interfaces/IDeFiOneV1Factory.sol

 --- 
### Functions:
### owner

```solidity
function owner() external view returns (address)
```

Returns the current owner of the factory

_Can be changed by the current owner via setOwner_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | The address of the factory owner |

### feeAmountTickSpacing

```solidity
function feeAmountTickSpacing(uint24 fee) external view returns (int24)
```

Returns the tick spacing for a given fee amount, if enabled, or 0 if not enabled

_A fee amount can never be removed, so this value should be hard coded or cached in the calling context_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| fee | uint24 | The enabled fee, denominated in hundredths of a bip. Returns 0 in case of unenabled fee |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | int24 | The tick spacing |

### getPool

```solidity
function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)
```

Returns the pool address for a given pair of tokens and a fee, or address 0 if it does not exist

_tokenA and tokenB may be passed in either token0/token1 or token1/token0 order_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenA | address | The contract address of either token0 or token1 |
| tokenB | address | The contract address of the other token |
| fee | uint24 | The fee collected upon every swap in the pool, denominated in hundredths of a bip |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| pool | address | The pool address |

### createPool

```solidity
function createPool(address tokenA, address tokenB, uint24 fee) external returns (address pool)
```

Creates a pool for the given two tokens and fee

_tokenA and tokenB may be passed in either order: token0/token1 or token1/token0. tickSpacing is retrieved
from the fee. The call will revert if the pool already exists, the fee is invalid, or the token arguments
are invalid._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenA | address | One of the two tokens in the desired pool |
| tokenB | address | The other of the two tokens in the desired pool |
| fee | uint24 | The desired fee for the pool |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| pool | address | The address of the newly created pool |

### setOwner

```solidity
function setOwner(address _owner) external
```

Updates the owner of the factory

_Must be called by the current owner_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _owner | address | The new owner of the factory |

### enableFeeAmount

```solidity
function enableFeeAmount(uint24 fee, int24 tickSpacing) external
```

Enables a fee amount with the given tickSpacing

_Fee amounts may never be removed once enabled_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| fee | uint24 | The fee amount to enable, denominated in hundredths of a bip (i.e. 1e-6) |
| tickSpacing | int24 | The spacing between ticks to be enforced for all pools created with the given fee amount |

 --- 
### Events:
### OwnerChanged

```solidity
event OwnerChanged(address oldOwner, address newOwner)
```

Emitted when the owner of the factory is changed

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| oldOwner | address | The owner before the owner was changed |
| newOwner | address | The owner after the owner was changed |

### PoolCreated

```solidity
event PoolCreated(address token0, address token1, uint24 fee, int24 tickSpacing, address pool)
```

Emitted when a pool is created

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token0 | address | The first token of the pool by address sort order |
| token1 | address | The second token of the pool by address sort order |
| fee | uint24 | The fee collected upon every swap in the pool, denominated in hundredths of a bip |
| tickSpacing | int24 | The minimum number of ticks between initialized ticks |
| pool | address | The address of the created pool |

### FeeAmountEnabled

```solidity
event FeeAmountEnabled(uint24 fee, int24 tickSpacing)
```

Emitted when a new fee amount is enabled for pool creation via the factory

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| fee | uint24 | The enabled fee, denominated in hundredths of a bip |
| tickSpacing | int24 | The minimum number of ticks between initialized ticks for pools created with the given fee |

## IDeFiOneV1Pool

A DeFi One pool facilitates swapping and automated market making between any two assets that strictly conform
to the ERC20 specification

_The pool interface is broken up into many smaller pieces_

### Contract
IDeFiOneV1Pool : contracts/contracts/interfaces/IDeFiOneV1Pool.sol

The pool interface is broken up into many smaller pieces

 --- 
### Functions:
inherits IDeFiOneV1PoolEvents:
inherits IDeFiOneV1PoolOwnerActions:
### setFeeProtocol

```solidity
function setFeeProtocol(uint8 feeProtocol0, uint8 feeProtocol1) external
```

Set the denominator of the protocol's % share of the fees

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| feeProtocol0 | uint8 | new protocol fee for token0 of the pool |
| feeProtocol1 | uint8 | new protocol fee for token1 of the pool |

### collectProtocol

```solidity
function collectProtocol(address recipient, uint128 amount0Requested, uint128 amount1Requested) external returns (uint128 amount0, uint128 amount1)
```

Collect the protocol fee accrued to the pool

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipient | address | The address to which collected protocol fees should be sent |
| amount0Requested | uint128 | The maximum amount of token0 to send, can be 0 to collect fees in only token1 |
| amount1Requested | uint128 | The maximum amount of token1 to send, can be 0 to collect fees in only token0 |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount0 | uint128 | The protocol fee collected in token0 |
| amount1 | uint128 | The protocol fee collected in token1 |

inherits IDeFiOneV1PoolActions:
### initialize

```solidity
function initialize(uint160 sqrtPriceX96) external
```

Sets the initial price for the pool

_Price is represented as a sqrt(amountToken1/amountToken0) Q64.96 value_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sqrtPriceX96 | uint160 | the initial sqrt price of the pool as a Q64.96 |

### mint

```solidity
function mint(address recipient, int24 tickLower, int24 tickUpper, uint128 amount, bytes data) external returns (uint256 amount0, uint256 amount1)
```

Adds liquidity for the given recipient/tickLower/tickUpper position

_The caller of this method receives a callback in the form of IDeFiOneV1MintCallback#defioneV1MintCallback
in which they must pay any token0 or token1 owed for the liquidity. The amount of token0/token1 due depends
on tickLower, tickUpper, the amount of liquidity, and the current price._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipient | address | The address for which the liquidity will be created |
| tickLower | int24 | The lower tick of the position in which to add liquidity |
| tickUpper | int24 | The upper tick of the position in which to add liquidity |
| amount | uint128 | The amount of liquidity to mint |
| data | bytes | Any data that should be passed through to the callback |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount0 | uint256 | The amount of token0 that was paid to mint the given amount of liquidity. Matches the value in the callback |
| amount1 | uint256 | The amount of token1 that was paid to mint the given amount of liquidity. Matches the value in the callback |

### collect

```solidity
function collect(address recipient, int24 tickLower, int24 tickUpper, uint128 amount0Requested, uint128 amount1Requested) external returns (uint128 amount0, uint128 amount1)
```

Collects tokens owed to a position

_Does not recompute fees earned, which must be done either via mint or burn of any amount of liquidity.
Collect must be called by the position owner. To withdraw only token0 or only token1, amount0Requested or
amount1Requested may be set to zero. To withdraw all tokens owed, caller may pass any value greater than the
actual tokens owed, e.g. type(uint128).max. Tokens owed may be from accumulated swap fees or burned liquidity._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipient | address | The address which should receive the fees collected |
| tickLower | int24 | The lower tick of the position for which to collect fees |
| tickUpper | int24 | The upper tick of the position for which to collect fees |
| amount0Requested | uint128 | How much token0 should be withdrawn from the fees owed |
| amount1Requested | uint128 | How much token1 should be withdrawn from the fees owed |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount0 | uint128 | The amount of fees collected in token0 |
| amount1 | uint128 | The amount of fees collected in token1 |

### burn

```solidity
function burn(int24 tickLower, int24 tickUpper, uint128 amount) external returns (uint256 amount0, uint256 amount1)
```

Burn liquidity from the sender and account tokens owed for the liquidity to the position

_Can be used to trigger a recalculation of fees owed to a position by calling with an amount of 0
Fees must be collected separately via a call to #collect_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tickLower | int24 | The lower tick of the position for which to burn liquidity |
| tickUpper | int24 | The upper tick of the position for which to burn liquidity |
| amount | uint128 | How much liquidity to burn |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount0 | uint256 | The amount of token0 sent to the recipient |
| amount1 | uint256 | The amount of token1 sent to the recipient |

### swap

```solidity
function swap(address recipient, bool zeroForOne, int256 amountSpecified, uint160 sqrtPriceLimitX96, bytes data) external returns (int256 amount0, int256 amount1)
```

Swap token0 for token1, or token1 for token0

_The caller of this method receives a callback in the form of IDeFiOneV1SwapCallback#defioneV1SwapCallback_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipient | address | The address to receive the output of the swap |
| zeroForOne | bool | The direction of the swap, true for token0 to token1, false for token1 to token0 |
| amountSpecified | int256 | The amount of the swap, which implicitly configures the swap as exact input (positive), or exact output (negative) |
| sqrtPriceLimitX96 | uint160 | The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap |
| data | bytes | Any data to be passed through to the callback |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount0 | int256 | The delta of the balance of token0 of the pool, exact when negative, minimum when positive |
| amount1 | int256 | The delta of the balance of token1 of the pool, exact when negative, minimum when positive |

### flash

```solidity
function flash(address recipient, uint256 amount0, uint256 amount1, bytes data) external
```

Receive token0 and/or token1 and pay it back, plus a fee, in the callback

_The caller of this method receives a callback in the form of IDeFiOneV1FlashCallback#defioneV1FlashCallback
Can be used to donate underlying tokens pro-rata to currently in-range liquidity providers by calling
with 0 amount{0,1} and sending the donation amount(s) from the callback_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipient | address | The address which will receive the token0 and token1 amounts |
| amount0 | uint256 | The amount of token0 to send |
| amount1 | uint256 | The amount of token1 to send |
| data | bytes | Any data to be passed through to the callback |

### increaseObservationCardinalityNext

```solidity
function increaseObservationCardinalityNext(uint16 observationCardinalityNext) external
```

Increase the maximum number of price and liquidity observations that this pool will store

_This method is no-op if the pool already has an observationCardinalityNext greater than or equal to
the input observationCardinalityNext._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| observationCardinalityNext | uint16 | The desired minimum number of observations for the pool to store |

inherits IDeFiOneV1PoolDerivedState:
### observe

```solidity
function observe(uint32[] secondsAgos) external view returns (int56[] tickCumulatives, uint160[] secondsPerLiquidityCumulativeX128s)
```

Returns the cumulative tick and liquidity as of each timestamp `secondsAgo` from the current block timestamp

_To get a time weighted average tick or liquidity-in-range, you must call this with two values, one representing
the beginning of the period and another for the end of the period. E.g., to get the last hour time-weighted average tick,
you must call it with secondsAgos = [3600, 0].
The time weighted average tick represents the geometric time weighted average price of the pool, in
log base sqrt(1.0001) of token1 / token0. The TickMath library can be used to go from a tick value to a ratio._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| secondsAgos | uint32[] | From how long ago each cumulative tick and liquidity value should be returned |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| tickCumulatives | int56[] | Cumulative tick values as of each `secondsAgos` from the current block timestamp |
| secondsPerLiquidityCumulativeX128s | uint160[] | Cumulative seconds per liquidity-in-range value as of each `secondsAgos` from the current block timestamp |

### snapshotCumulativesInside

```solidity
function snapshotCumulativesInside(int24 tickLower, int24 tickUpper) external view returns (int56 tickCumulativeInside, uint160 secondsPerLiquidityInsideX128, uint32 secondsInside)
```

Returns a snapshot of the tick cumulative, seconds per liquidity and seconds inside a tick range

_Snapshots must only be compared to other snapshots, taken over a period for which a position existed.
I.e., snapshots cannot be compared if a position is not held for the entire period between when the first
snapshot is taken and the second snapshot is taken._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tickLower | int24 | The lower tick of the range |
| tickUpper | int24 | The upper tick of the range |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| tickCumulativeInside | int56 | The snapshot of the tick accumulator for the range |
| secondsPerLiquidityInsideX128 | uint160 | The snapshot of seconds per liquidity for the range |
| secondsInside | uint32 | The snapshot of seconds per liquidity for the range |

inherits IDeFiOneV1PoolState:
### slot0

```solidity
function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)
```

The 0th storage slot in the pool stores many values, and is exposed as a single method to save gas
when accessed externally.

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| sqrtPriceX96 | uint160 | The current price of the pool as a sqrt(token1/token0) Q64.96 value tick The current tick of the pool, i.e. according to the last tick transition that was run. This value may not always be equal to SqrtTickMath.getTickAtSqrtRatio(sqrtPriceX96) if the price is on a tick boundary. observationIndex The index of the last oracle observation that was written, observationCardinality The current maximum number of observations stored in the pool, observationCardinalityNext The next maximum number of observations, to be updated when the observation. feeProtocol The protocol fee for both tokens of the pool. Encoded as two 4 bit values, where the protocol fee of token1 is shifted 4 bits and the protocol fee of token0 is the lower 4 bits. Used as the denominator of a fraction of the swap fee, e.g. 4 means 1/4th of the swap fee. unlocked Whether the pool is currently locked to reentrancy |
| tick | int24 |  |
| observationIndex | uint16 |  |
| observationCardinality | uint16 |  |
| observationCardinalityNext | uint16 |  |
| feeProtocol | uint8 |  |
| unlocked | bool |  |

### feeGrowthGlobal0X128

```solidity
function feeGrowthGlobal0X128() external view returns (uint256)
```

The fee growth as a Q128.128 fees of token0 collected per unit of liquidity for the entire life of the pool

_This value can overflow the uint256_

### feeGrowthGlobal1X128

```solidity
function feeGrowthGlobal1X128() external view returns (uint256)
```

The fee growth as a Q128.128 fees of token1 collected per unit of liquidity for the entire life of the pool

_This value can overflow the uint256_

### protocolFees

```solidity
function protocolFees() external view returns (uint128 token0, uint128 token1)
```

The amounts of token0 and token1 that are owed to the protocol

_Protocol fees will never exceed uint128 max in either token_

### liquidity

```solidity
function liquidity() external view returns (uint128)
```

The currently in range liquidity available to the pool

_This value has no relationship to the total liquidity across all ticks_

### ticks

```solidity
function ticks(int24 tick) external view returns (uint128 liquidityGross, int128 liquidityNet, uint256 feeGrowthOutside0X128, uint256 feeGrowthOutside1X128, int56 tickCumulativeOutside, uint160 secondsPerLiquidityOutsideX128, uint32 secondsOutside, bool initialized)
```

Look up information about a specific tick in the pool

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tick | int24 | The tick to look up |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| liquidityGross | uint128 | the total amount of position liquidity that uses the pool either as tick lower or tick upper, liquidityNet how much liquidity changes when the pool price crosses the tick, feeGrowthOutside0X128 the fee growth on the other side of the tick from the current tick in token0, feeGrowthOutside1X128 the fee growth on the other side of the tick from the current tick in token1, tickCumulativeOutside the cumulative tick value on the other side of the tick from the current tick secondsPerLiquidityOutsideX128 the seconds spent per liquidity on the other side of the tick from the current tick, secondsOutside the seconds spent on the other side of the tick from the current tick, initialized Set to true if the tick is initialized, i.e. liquidityGross is greater than 0, otherwise equal to false. Outside values can only be used if the tick is initialized, i.e. if liquidityGross is greater than 0. In addition, these values are only relative and must be used only in comparison to previous snapshots for a specific position. |
| liquidityNet | int128 |  |
| feeGrowthOutside0X128 | uint256 |  |
| feeGrowthOutside1X128 | uint256 |  |
| tickCumulativeOutside | int56 |  |
| secondsPerLiquidityOutsideX128 | uint160 |  |
| secondsOutside | uint32 |  |
| initialized | bool |  |

### tickBitmap

```solidity
function tickBitmap(int16 wordPosition) external view returns (uint256)
```

Returns 256 packed tick initialized boolean values. See TickBitmap for more information

### positions

```solidity
function positions(bytes32 key) external view returns (uint128 _liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)
```

Returns the information about a position by the position's key

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| key | bytes32 | The position's key is a hash of a preimage composed by the owner, tickLower and tickUpper |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| _liquidity | uint128 | The amount of liquidity in the position, Returns feeGrowthInside0LastX128 fee growth of token0 inside the tick range as of the last mint/burn/poke, Returns feeGrowthInside1LastX128 fee growth of token1 inside the tick range as of the last mint/burn/poke, Returns tokensOwed0 the computed amount of token0 owed to the position as of the last mint/burn/poke, Returns tokensOwed1 the computed amount of token1 owed to the position as of the last mint/burn/poke |
| feeGrowthInside0LastX128 | uint256 |  |
| feeGrowthInside1LastX128 | uint256 |  |
| tokensOwed0 | uint128 |  |
| tokensOwed1 | uint128 |  |

### observations

```solidity
function observations(uint256 index) external view returns (uint32 blockTimestamp, int56 tickCumulative, uint160 secondsPerLiquidityCumulativeX128, bool initialized)
```

Returns data about a specific observation index

_You most likely want to use #observe() instead of this method to get an observation as of some amount of time
ago, rather than at a specific index in the array._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| index | uint256 | The element of the observations array to fetch |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| blockTimestamp | uint32 | The timestamp of the observation, Returns tickCumulative the tick multiplied by seconds elapsed for the life of the pool as of the observation timestamp, Returns secondsPerLiquidityCumulativeX128 the seconds per in range liquidity for the life of the pool as of the observation timestamp, Returns initialized whether the observation has been initialized and the values are safe to use |
| tickCumulative | int56 |  |
| secondsPerLiquidityCumulativeX128 | uint160 |  |
| initialized | bool |  |

inherits IDeFiOneV1PoolImmutables:
### factory

```solidity
function factory() external view returns (address)
```

The contract that deployed the pool, which must adhere to the IDeFiOneV1Factory interface

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | The contract address |

### token0

```solidity
function token0() external view returns (address)
```

The first of the two tokens of the pool, sorted by address

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | The token contract address |

### token1

```solidity
function token1() external view returns (address)
```

The second of the two tokens of the pool, sorted by address

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | The token contract address |

### fee

```solidity
function fee() external view returns (uint24)
```

The pool's fee in hundredths of a bip, i.e. 1e-6

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint24 | The fee |

### tickSpacing

```solidity
function tickSpacing() external view returns (int24)
```

The pool tick spacing

_Ticks can only be used at multiples of this value, minimum of 1 and always positive
e.g.: a tickSpacing of 3 means ticks can be initialized every 3rd tick, i.e., ..., -6, -3, 0, 3, 6, ...
This value is an int24 to avoid casting even though it is always positive._

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | int24 | The tick spacing |

### maxLiquidityPerTick

```solidity
function maxLiquidityPerTick() external view returns (uint128)
```

The maximum amount of position liquidity that can use any tick in the range

_This parameter is enforced per tick to prevent liquidity from overflowing a uint128 at any point, and
also prevents out-of-range liquidity from being used to prevent adding in-range liquidity to a pool_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint128 | The max amount of liquidity per tick |

 --- 
### Events:
inherits IDeFiOneV1PoolEvents:
### Initialize

```solidity
event Initialize(uint160 sqrtPriceX96, int24 tick)
```

Emitted exactly once by a pool when #initialize is first called on the pool

_Mint/Burn/Swap cannot be emitted by the pool before Initialize_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sqrtPriceX96 | uint160 | The initial sqrt price of the pool, as a Q64.96 |
| tick | int24 | The initial tick of the pool, i.e. log base 1.0001 of the starting price of the pool |

### Mint

```solidity
event Mint(address sender, address owner, int24 tickLower, int24 tickUpper, uint128 amount, uint256 amount0, uint256 amount1)
```

Emitted when liquidity is minted for a given position

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sender | address | The address that minted the liquidity |
| owner | address | The owner of the position and recipient of any minted liquidity |
| tickLower | int24 | The lower tick of the position |
| tickUpper | int24 | The upper tick of the position |
| amount | uint128 | The amount of liquidity minted to the position range |
| amount0 | uint256 | How much token0 was required for the minted liquidity |
| amount1 | uint256 | How much token1 was required for the minted liquidity |

### Collect

```solidity
event Collect(address owner, address recipient, int24 tickLower, int24 tickUpper, uint128 amount0, uint128 amount1)
```

Emitted when fees are collected by the owner of a position

_Collect events may be emitted with zero amount0 and amount1 when the caller chooses not to collect fees_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | The owner of the position for which fees are collected |
| recipient | address |  |
| tickLower | int24 | The lower tick of the position |
| tickUpper | int24 | The upper tick of the position |
| amount0 | uint128 | The amount of token0 fees collected |
| amount1 | uint128 | The amount of token1 fees collected |

### Burn

```solidity
event Burn(address owner, int24 tickLower, int24 tickUpper, uint128 amount, uint256 amount0, uint256 amount1)
```

Emitted when a position's liquidity is removed

_Does not withdraw any fees earned by the liquidity position, which must be withdrawn via #collect_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | The owner of the position for which liquidity is removed |
| tickLower | int24 | The lower tick of the position |
| tickUpper | int24 | The upper tick of the position |
| amount | uint128 | The amount of liquidity to remove |
| amount0 | uint256 | The amount of token0 withdrawn |
| amount1 | uint256 | The amount of token1 withdrawn |

### Swap

```solidity
event Swap(address sender, address recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)
```

Emitted by the pool for any swaps between token0 and token1

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sender | address | The address that initiated the swap call, and that received the callback |
| recipient | address | The address that received the output of the swap |
| amount0 | int256 | The delta of the token0 balance of the pool |
| amount1 | int256 | The delta of the token1 balance of the pool |
| sqrtPriceX96 | uint160 | The sqrt(price) of the pool after the swap, as a Q64.96 |
| liquidity | uint128 | The liquidity of the pool after the swap |
| tick | int24 | The log base 1.0001 of price of the pool after the swap |

### Flash

```solidity
event Flash(address sender, address recipient, uint256 amount0, uint256 amount1, uint256 paid0, uint256 paid1)
```

Emitted by the pool for any flashes of token0/token1

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sender | address | The address that initiated the swap call, and that received the callback |
| recipient | address | The address that received the tokens from flash |
| amount0 | uint256 | The amount of token0 that was flashed |
| amount1 | uint256 | The amount of token1 that was flashed |
| paid0 | uint256 | The amount of token0 paid for the flash, which can exceed the amount0 plus the fee |
| paid1 | uint256 | The amount of token1 paid for the flash, which can exceed the amount1 plus the fee |

### IncreaseObservationCardinalityNext

```solidity
event IncreaseObservationCardinalityNext(uint16 observationCardinalityNextOld, uint16 observationCardinalityNextNew)
```

Emitted by the pool for increases to the number of observations that can be stored

_observationCardinalityNext is not the observation cardinality until an observation is written at the index
just before a mint/swap/burn._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| observationCardinalityNextOld | uint16 | The previous value of the next observation cardinality |
| observationCardinalityNextNew | uint16 | The updated value of the next observation cardinality |

### SetFeeProtocol

```solidity
event SetFeeProtocol(uint8 feeProtocol0Old, uint8 feeProtocol1Old, uint8 feeProtocol0New, uint8 feeProtocol1New)
```

Emitted when the protocol fee is changed by the pool

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| feeProtocol0Old | uint8 | The previous value of the token0 protocol fee |
| feeProtocol1Old | uint8 | The previous value of the token1 protocol fee |
| feeProtocol0New | uint8 | The updated value of the token0 protocol fee |
| feeProtocol1New | uint8 | The updated value of the token1 protocol fee |

### CollectProtocol

```solidity
event CollectProtocol(address sender, address recipient, uint128 amount0, uint128 amount1)
```

Emitted when the collected protocol fees are withdrawn by the factory owner

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sender | address | The address that collects the protocol fees |
| recipient | address | The address that receives the collected protocol fees |
| amount0 | uint128 | The amount of token0 protocol fees that is withdrawn |
| amount1 | uint128 |  |

inherits IDeFiOneV1PoolOwnerActions:
inherits IDeFiOneV1PoolActions:
inherits IDeFiOneV1PoolDerivedState:
inherits IDeFiOneV1PoolState:
inherits IDeFiOneV1PoolImmutables:

## IDeFiOneV1PoolDeployer

A contract that constructs a pool must implement this to pass arguments to the pool

_This is used to avoid having constructor arguments in the pool contract, which results in the init code hash
of the pool being constant allowing the CREATE2 address of the pool to be cheaply computed on-chain_

### Contract
IDeFiOneV1PoolDeployer : contracts/contracts/interfaces/IDeFiOneV1PoolDeployer.sol

This is used to avoid having constructor arguments in the pool contract, which results in the init code hash
of the pool being constant allowing the CREATE2 address of the pool to be cheaply computed on-chain

 --- 
### Functions:
### parameters

```solidity
function parameters() external view returns (address factory, address token0, address token1, uint24 fee, int24 tickSpacing)
```

Get the parameters to be used in constructing the pool, set transiently during pool creation.

_Called by the pool constructor to fetch the parameters of the pool
Returns factory The factory address
Returns token0 The first token of the pool by address sort order
Returns token1 The second token of the pool by address sort order
Returns fee The fee collected upon every swap in the pool, denominated in hundredths of a bip
Returns tickSpacing The minimum number of ticks between initialized ticks_

## IERC20Minimal

Contains a subset of the full ERC20 interface that is used in DeFiOne V1

### Contract
IERC20Minimal : contracts/contracts/interfaces/IERC20Minimal.sol

 --- 
### Functions:
### balanceOf

```solidity
function balanceOf(address account) external view returns (uint256)
```

Returns the balance of a token

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The account for which to look up the number of tokens it has, i.e. its balance |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The number of tokens held by the account |

### transfer

```solidity
function transfer(address recipient, uint256 amount) external returns (bool)
```

Transfers the amount of token from the `msg.sender` to the recipient

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipient | address | The account that will receive the amount transferred |
| amount | uint256 | The number of tokens to send from the sender to the recipient |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | Returns true for a successful transfer, false for an unsuccessful transfer |

### allowance

```solidity
function allowance(address owner, address spender) external view returns (uint256)
```

Returns the current allowance given to a spender by an owner

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | The account of the token owner |
| spender | address | The account of the token spender |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The current allowance granted by `owner` to `spender` |

### approve

```solidity
function approve(address spender, uint256 amount) external returns (bool)
```

Sets the allowance of a spender from the `msg.sender` to the value `amount`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| spender | address | The account which will be allowed to spend a given amount of the owners tokens |
| amount | uint256 | The amount of tokens allowed to be used by `spender` |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | Returns true for a successful approval, false for unsuccessful |

### transferFrom

```solidity
function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)
```

Transfers `amount` tokens from `sender` to `recipient` up to the allowance given to the `msg.sender`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sender | address | The account from which the transfer will be initiated |
| recipient | address | The recipient of the transfer |
| amount | uint256 | The amount of the transfer |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | Returns true for a successful transfer, false for unsuccessful |

 --- 
### Events:
### Transfer

```solidity
event Transfer(address from, address to, uint256 value)
```

Event emitted when tokens are transferred from one address to another, either via `#transfer` or `#transferFrom`.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | The account from which the tokens were sent, i.e. the balance decreased |
| to | address | The account to which the tokens were sent, i.e. the balance increased |
| value | uint256 | The amount of tokens that were transferred |

### Approval

```solidity
event Approval(address owner, address spender, uint256 value)
```

Event emitted when the approval amount for the spender of a given owner's tokens changes.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | The account that approved spending of its tokens |
| spender | address | The account for which the spending allowance was modified |
| value | uint256 | The new allowance from the owner to the spender |

## IDeFiOneV1FlashCallback

Any contract that calls IDeFiOneV1PoolActions#flash must implement this interface

### Contract
IDeFiOneV1FlashCallback : contracts/contracts/interfaces/callback/IDeFiOneV1FlashCallback.sol

 --- 
### Functions:
### defioneV1FlashCallback

```solidity
function defioneV1FlashCallback(uint256 fee0, uint256 fee1, bytes data) external
```

Called to `msg.sender` after transferring to the recipient from IDeFiOneV1Pool#flash.

_In the implementation you must repay the pool the tokens sent by flash plus the computed fee amounts.
The caller of this method must be checked to be a DeFiOneV1Pool deployed by the canonical DeFiOneV1Factory._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| fee0 | uint256 | The fee amount in token0 due to the pool by the end of the flash |
| fee1 | uint256 | The fee amount in token1 due to the pool by the end of the flash |
| data | bytes | Any data passed through by the caller via the IDeFiOneV1PoolActions#flash call |

## IDeFiOneV1MintCallback

Any contract that calls IDeFiOneV1PoolActions#mint must implement this interface

### Contract
IDeFiOneV1MintCallback : contracts/contracts/interfaces/callback/IDeFiOneV1MintCallback.sol

 --- 
### Functions:
### defioneV1MintCallback

```solidity
function defioneV1MintCallback(uint256 amount0Owed, uint256 amount1Owed, bytes data) external
```

Called to `msg.sender` after minting liquidity to a position from IDeFiOneV1Pool#mint.

_In the implementation you must pay the pool tokens owed for the minted liquidity.
The caller of this method must be checked to be a DeFiOneV1Pool deployed by the canonical DeFiOneV1Factory._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount0Owed | uint256 | The amount of token0 due to the pool for the minted liquidity |
| amount1Owed | uint256 | The amount of token1 due to the pool for the minted liquidity |
| data | bytes | Any data passed through by the caller via the IDeFiOneV1PoolActions#mint call |

## IDeFiOneV1SwapCallback

Any contract that calls IDeFiOneV1PoolActions#swap must implement this interface

### Contract
IDeFiOneV1SwapCallback : contracts/contracts/interfaces/callback/IDeFiOneV1SwapCallback.sol

 --- 
### Functions:
### defioneV1SwapCallback

```solidity
function defioneV1SwapCallback(int256 amount0Delta, int256 amount1Delta, bytes data) external
```

Called to `msg.sender` after executing a swap via IDeFiOneV1Pool#swap.

_In the implementation you must pay the pool tokens owed for the swap.
The caller of this method must be checked to be a DeFiOneV1Pool deployed by the canonical DeFiOneV1Factory.
amount0Delta and amount1Delta can both be 0 if no tokens were swapped._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount0Delta | int256 | The amount of token0 that was sent (negative) or must be received (positive) by the pool by the end of the swap. If positive, the callback must send that amount of token0 to the pool. |
| amount1Delta | int256 | The amount of token1 that was sent (negative) or must be received (positive) by the pool by the end of the swap. If positive, the callback must send that amount of token1 to the pool. |
| data | bytes | Any data passed through by the caller via the IDeFiOneV1PoolActions#swap call |

## IDeFiOneV1PoolActions

Contains pool methods that can be called by anyone

### Contract
IDeFiOneV1PoolActions : contracts/contracts/interfaces/pool/IDeFiOneV1PoolActions.sol

 --- 
### Functions:
### initialize

```solidity
function initialize(uint160 sqrtPriceX96) external
```

Sets the initial price for the pool

_Price is represented as a sqrt(amountToken1/amountToken0) Q64.96 value_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sqrtPriceX96 | uint160 | the initial sqrt price of the pool as a Q64.96 |

### mint

```solidity
function mint(address recipient, int24 tickLower, int24 tickUpper, uint128 amount, bytes data) external returns (uint256 amount0, uint256 amount1)
```

Adds liquidity for the given recipient/tickLower/tickUpper position

_The caller of this method receives a callback in the form of IDeFiOneV1MintCallback#defioneV1MintCallback
in which they must pay any token0 or token1 owed for the liquidity. The amount of token0/token1 due depends
on tickLower, tickUpper, the amount of liquidity, and the current price._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipient | address | The address for which the liquidity will be created |
| tickLower | int24 | The lower tick of the position in which to add liquidity |
| tickUpper | int24 | The upper tick of the position in which to add liquidity |
| amount | uint128 | The amount of liquidity to mint |
| data | bytes | Any data that should be passed through to the callback |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount0 | uint256 | The amount of token0 that was paid to mint the given amount of liquidity. Matches the value in the callback |
| amount1 | uint256 | The amount of token1 that was paid to mint the given amount of liquidity. Matches the value in the callback |

### collect

```solidity
function collect(address recipient, int24 tickLower, int24 tickUpper, uint128 amount0Requested, uint128 amount1Requested) external returns (uint128 amount0, uint128 amount1)
```

Collects tokens owed to a position

_Does not recompute fees earned, which must be done either via mint or burn of any amount of liquidity.
Collect must be called by the position owner. To withdraw only token0 or only token1, amount0Requested or
amount1Requested may be set to zero. To withdraw all tokens owed, caller may pass any value greater than the
actual tokens owed, e.g. type(uint128).max. Tokens owed may be from accumulated swap fees or burned liquidity._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipient | address | The address which should receive the fees collected |
| tickLower | int24 | The lower tick of the position for which to collect fees |
| tickUpper | int24 | The upper tick of the position for which to collect fees |
| amount0Requested | uint128 | How much token0 should be withdrawn from the fees owed |
| amount1Requested | uint128 | How much token1 should be withdrawn from the fees owed |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount0 | uint128 | The amount of fees collected in token0 |
| amount1 | uint128 | The amount of fees collected in token1 |

### burn

```solidity
function burn(int24 tickLower, int24 tickUpper, uint128 amount) external returns (uint256 amount0, uint256 amount1)
```

Burn liquidity from the sender and account tokens owed for the liquidity to the position

_Can be used to trigger a recalculation of fees owed to a position by calling with an amount of 0
Fees must be collected separately via a call to #collect_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tickLower | int24 | The lower tick of the position for which to burn liquidity |
| tickUpper | int24 | The upper tick of the position for which to burn liquidity |
| amount | uint128 | How much liquidity to burn |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount0 | uint256 | The amount of token0 sent to the recipient |
| amount1 | uint256 | The amount of token1 sent to the recipient |

### swap

```solidity
function swap(address recipient, bool zeroForOne, int256 amountSpecified, uint160 sqrtPriceLimitX96, bytes data) external returns (int256 amount0, int256 amount1)
```

Swap token0 for token1, or token1 for token0

_The caller of this method receives a callback in the form of IDeFiOneV1SwapCallback#defioneV1SwapCallback_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipient | address | The address to receive the output of the swap |
| zeroForOne | bool | The direction of the swap, true for token0 to token1, false for token1 to token0 |
| amountSpecified | int256 | The amount of the swap, which implicitly configures the swap as exact input (positive), or exact output (negative) |
| sqrtPriceLimitX96 | uint160 | The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this value after the swap. If one for zero, the price cannot be greater than this value after the swap |
| data | bytes | Any data to be passed through to the callback |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount0 | int256 | The delta of the balance of token0 of the pool, exact when negative, minimum when positive |
| amount1 | int256 | The delta of the balance of token1 of the pool, exact when negative, minimum when positive |

### flash

```solidity
function flash(address recipient, uint256 amount0, uint256 amount1, bytes data) external
```

Receive token0 and/or token1 and pay it back, plus a fee, in the callback

_The caller of this method receives a callback in the form of IDeFiOneV1FlashCallback#defioneV1FlashCallback
Can be used to donate underlying tokens pro-rata to currently in-range liquidity providers by calling
with 0 amount{0,1} and sending the donation amount(s) from the callback_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipient | address | The address which will receive the token0 and token1 amounts |
| amount0 | uint256 | The amount of token0 to send |
| amount1 | uint256 | The amount of token1 to send |
| data | bytes | Any data to be passed through to the callback |

### increaseObservationCardinalityNext

```solidity
function increaseObservationCardinalityNext(uint16 observationCardinalityNext) external
```

Increase the maximum number of price and liquidity observations that this pool will store

_This method is no-op if the pool already has an observationCardinalityNext greater than or equal to
the input observationCardinalityNext._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| observationCardinalityNext | uint16 | The desired minimum number of observations for the pool to store |

## IDeFiOneV1PoolDerivedState

Contains view functions to provide information about the pool that is computed rather than stored on the
blockchain. The functions here may have variable gas costs.

### Contract
IDeFiOneV1PoolDerivedState : contracts/contracts/interfaces/pool/IDeFiOneV1PoolDerivedState.sol

 --- 
### Functions:
### observe

```solidity
function observe(uint32[] secondsAgos) external view returns (int56[] tickCumulatives, uint160[] secondsPerLiquidityCumulativeX128s)
```

Returns the cumulative tick and liquidity as of each timestamp `secondsAgo` from the current block timestamp

_To get a time weighted average tick or liquidity-in-range, you must call this with two values, one representing
the beginning of the period and another for the end of the period. E.g., to get the last hour time-weighted average tick,
you must call it with secondsAgos = [3600, 0].
The time weighted average tick represents the geometric time weighted average price of the pool, in
log base sqrt(1.0001) of token1 / token0. The TickMath library can be used to go from a tick value to a ratio._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| secondsAgos | uint32[] | From how long ago each cumulative tick and liquidity value should be returned |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| tickCumulatives | int56[] | Cumulative tick values as of each `secondsAgos` from the current block timestamp |
| secondsPerLiquidityCumulativeX128s | uint160[] | Cumulative seconds per liquidity-in-range value as of each `secondsAgos` from the current block timestamp |

### snapshotCumulativesInside

```solidity
function snapshotCumulativesInside(int24 tickLower, int24 tickUpper) external view returns (int56 tickCumulativeInside, uint160 secondsPerLiquidityInsideX128, uint32 secondsInside)
```

Returns a snapshot of the tick cumulative, seconds per liquidity and seconds inside a tick range

_Snapshots must only be compared to other snapshots, taken over a period for which a position existed.
I.e., snapshots cannot be compared if a position is not held for the entire period between when the first
snapshot is taken and the second snapshot is taken._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tickLower | int24 | The lower tick of the range |
| tickUpper | int24 | The upper tick of the range |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| tickCumulativeInside | int56 | The snapshot of the tick accumulator for the range |
| secondsPerLiquidityInsideX128 | uint160 | The snapshot of seconds per liquidity for the range |
| secondsInside | uint32 | The snapshot of seconds per liquidity for the range |

## IDeFiOneV1PoolEvents

Contains all events emitted by the pool

### Contract
IDeFiOneV1PoolEvents : contracts/contracts/interfaces/pool/IDeFiOneV1PoolEvents.sol

 --- 
### Events:
### Initialize

```solidity
event Initialize(uint160 sqrtPriceX96, int24 tick)
```

Emitted exactly once by a pool when #initialize is first called on the pool

_Mint/Burn/Swap cannot be emitted by the pool before Initialize_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sqrtPriceX96 | uint160 | The initial sqrt price of the pool, as a Q64.96 |
| tick | int24 | The initial tick of the pool, i.e. log base 1.0001 of the starting price of the pool |

### Mint

```solidity
event Mint(address sender, address owner, int24 tickLower, int24 tickUpper, uint128 amount, uint256 amount0, uint256 amount1)
```

Emitted when liquidity is minted for a given position

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sender | address | The address that minted the liquidity |
| owner | address | The owner of the position and recipient of any minted liquidity |
| tickLower | int24 | The lower tick of the position |
| tickUpper | int24 | The upper tick of the position |
| amount | uint128 | The amount of liquidity minted to the position range |
| amount0 | uint256 | How much token0 was required for the minted liquidity |
| amount1 | uint256 | How much token1 was required for the minted liquidity |

### Collect

```solidity
event Collect(address owner, address recipient, int24 tickLower, int24 tickUpper, uint128 amount0, uint128 amount1)
```

Emitted when fees are collected by the owner of a position

_Collect events may be emitted with zero amount0 and amount1 when the caller chooses not to collect fees_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | The owner of the position for which fees are collected |
| recipient | address |  |
| tickLower | int24 | The lower tick of the position |
| tickUpper | int24 | The upper tick of the position |
| amount0 | uint128 | The amount of token0 fees collected |
| amount1 | uint128 | The amount of token1 fees collected |

### Burn

```solidity
event Burn(address owner, int24 tickLower, int24 tickUpper, uint128 amount, uint256 amount0, uint256 amount1)
```

Emitted when a position's liquidity is removed

_Does not withdraw any fees earned by the liquidity position, which must be withdrawn via #collect_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | The owner of the position for which liquidity is removed |
| tickLower | int24 | The lower tick of the position |
| tickUpper | int24 | The upper tick of the position |
| amount | uint128 | The amount of liquidity to remove |
| amount0 | uint256 | The amount of token0 withdrawn |
| amount1 | uint256 | The amount of token1 withdrawn |

### Swap

```solidity
event Swap(address sender, address recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)
```

Emitted by the pool for any swaps between token0 and token1

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sender | address | The address that initiated the swap call, and that received the callback |
| recipient | address | The address that received the output of the swap |
| amount0 | int256 | The delta of the token0 balance of the pool |
| amount1 | int256 | The delta of the token1 balance of the pool |
| sqrtPriceX96 | uint160 | The sqrt(price) of the pool after the swap, as a Q64.96 |
| liquidity | uint128 | The liquidity of the pool after the swap |
| tick | int24 | The log base 1.0001 of price of the pool after the swap |

### Flash

```solidity
event Flash(address sender, address recipient, uint256 amount0, uint256 amount1, uint256 paid0, uint256 paid1)
```

Emitted by the pool for any flashes of token0/token1

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sender | address | The address that initiated the swap call, and that received the callback |
| recipient | address | The address that received the tokens from flash |
| amount0 | uint256 | The amount of token0 that was flashed |
| amount1 | uint256 | The amount of token1 that was flashed |
| paid0 | uint256 | The amount of token0 paid for the flash, which can exceed the amount0 plus the fee |
| paid1 | uint256 | The amount of token1 paid for the flash, which can exceed the amount1 plus the fee |

### IncreaseObservationCardinalityNext

```solidity
event IncreaseObservationCardinalityNext(uint16 observationCardinalityNextOld, uint16 observationCardinalityNextNew)
```

Emitted by the pool for increases to the number of observations that can be stored

_observationCardinalityNext is not the observation cardinality until an observation is written at the index
just before a mint/swap/burn._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| observationCardinalityNextOld | uint16 | The previous value of the next observation cardinality |
| observationCardinalityNextNew | uint16 | The updated value of the next observation cardinality |

### SetFeeProtocol

```solidity
event SetFeeProtocol(uint8 feeProtocol0Old, uint8 feeProtocol1Old, uint8 feeProtocol0New, uint8 feeProtocol1New)
```

Emitted when the protocol fee is changed by the pool

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| feeProtocol0Old | uint8 | The previous value of the token0 protocol fee |
| feeProtocol1Old | uint8 | The previous value of the token1 protocol fee |
| feeProtocol0New | uint8 | The updated value of the token0 protocol fee |
| feeProtocol1New | uint8 | The updated value of the token1 protocol fee |

### CollectProtocol

```solidity
event CollectProtocol(address sender, address recipient, uint128 amount0, uint128 amount1)
```

Emitted when the collected protocol fees are withdrawn by the factory owner

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sender | address | The address that collects the protocol fees |
| recipient | address | The address that receives the collected protocol fees |
| amount0 | uint128 | The amount of token0 protocol fees that is withdrawn |
| amount1 | uint128 |  |

## IDeFiOneV1PoolImmutables

These parameters are fixed for a pool forever, i.e., the methods will always return the same values

### Contract
IDeFiOneV1PoolImmutables : contracts/contracts/interfaces/pool/IDeFiOneV1PoolImmutables.sol

 --- 
### Functions:
### factory

```solidity
function factory() external view returns (address)
```

The contract that deployed the pool, which must adhere to the IDeFiOneV1Factory interface

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | The contract address |

### token0

```solidity
function token0() external view returns (address)
```

The first of the two tokens of the pool, sorted by address

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | The token contract address |

### token1

```solidity
function token1() external view returns (address)
```

The second of the two tokens of the pool, sorted by address

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | The token contract address |

### fee

```solidity
function fee() external view returns (uint24)
```

The pool's fee in hundredths of a bip, i.e. 1e-6

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint24 | The fee |

### tickSpacing

```solidity
function tickSpacing() external view returns (int24)
```

The pool tick spacing

_Ticks can only be used at multiples of this value, minimum of 1 and always positive
e.g.: a tickSpacing of 3 means ticks can be initialized every 3rd tick, i.e., ..., -6, -3, 0, 3, 6, ...
This value is an int24 to avoid casting even though it is always positive._

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | int24 | The tick spacing |

### maxLiquidityPerTick

```solidity
function maxLiquidityPerTick() external view returns (uint128)
```

The maximum amount of position liquidity that can use any tick in the range

_This parameter is enforced per tick to prevent liquidity from overflowing a uint128 at any point, and
also prevents out-of-range liquidity from being used to prevent adding in-range liquidity to a pool_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint128 | The max amount of liquidity per tick |

## IDeFiOneV1PoolOwnerActions

Contains pool methods that may only be called by the factory owner

### Contract
IDeFiOneV1PoolOwnerActions : contracts/contracts/interfaces/pool/IDeFiOneV1PoolOwnerActions.sol

 --- 
### Functions:
### setFeeProtocol

```solidity
function setFeeProtocol(uint8 feeProtocol0, uint8 feeProtocol1) external
```

Set the denominator of the protocol's % share of the fees

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| feeProtocol0 | uint8 | new protocol fee for token0 of the pool |
| feeProtocol1 | uint8 | new protocol fee for token1 of the pool |

### collectProtocol

```solidity
function collectProtocol(address recipient, uint128 amount0Requested, uint128 amount1Requested) external returns (uint128 amount0, uint128 amount1)
```

Collect the protocol fee accrued to the pool

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| recipient | address | The address to which collected protocol fees should be sent |
| amount0Requested | uint128 | The maximum amount of token0 to send, can be 0 to collect fees in only token1 |
| amount1Requested | uint128 | The maximum amount of token1 to send, can be 0 to collect fees in only token0 |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount0 | uint128 | The protocol fee collected in token0 |
| amount1 | uint128 | The protocol fee collected in token1 |

## IDeFiOneV1PoolState

These methods compose the pool's state, and can change with any frequency including multiple times
per transaction

### Contract
IDeFiOneV1PoolState : contracts/contracts/interfaces/pool/IDeFiOneV1PoolState.sol

 --- 
### Functions:
### slot0

```solidity
function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)
```

The 0th storage slot in the pool stores many values, and is exposed as a single method to save gas
when accessed externally.

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| sqrtPriceX96 | uint160 | The current price of the pool as a sqrt(token1/token0) Q64.96 value tick The current tick of the pool, i.e. according to the last tick transition that was run. This value may not always be equal to SqrtTickMath.getTickAtSqrtRatio(sqrtPriceX96) if the price is on a tick boundary. observationIndex The index of the last oracle observation that was written, observationCardinality The current maximum number of observations stored in the pool, observationCardinalityNext The next maximum number of observations, to be updated when the observation. feeProtocol The protocol fee for both tokens of the pool. Encoded as two 4 bit values, where the protocol fee of token1 is shifted 4 bits and the protocol fee of token0 is the lower 4 bits. Used as the denominator of a fraction of the swap fee, e.g. 4 means 1/4th of the swap fee. unlocked Whether the pool is currently locked to reentrancy |
| tick | int24 |  |
| observationIndex | uint16 |  |
| observationCardinality | uint16 |  |
| observationCardinalityNext | uint16 |  |
| feeProtocol | uint8 |  |
| unlocked | bool |  |

### feeGrowthGlobal0X128

```solidity
function feeGrowthGlobal0X128() external view returns (uint256)
```

The fee growth as a Q128.128 fees of token0 collected per unit of liquidity for the entire life of the pool

_This value can overflow the uint256_

### feeGrowthGlobal1X128

```solidity
function feeGrowthGlobal1X128() external view returns (uint256)
```

The fee growth as a Q128.128 fees of token1 collected per unit of liquidity for the entire life of the pool

_This value can overflow the uint256_

### protocolFees

```solidity
function protocolFees() external view returns (uint128 token0, uint128 token1)
```

The amounts of token0 and token1 that are owed to the protocol

_Protocol fees will never exceed uint128 max in either token_

### liquidity

```solidity
function liquidity() external view returns (uint128)
```

The currently in range liquidity available to the pool

_This value has no relationship to the total liquidity across all ticks_

### ticks

```solidity
function ticks(int24 tick) external view returns (uint128 liquidityGross, int128 liquidityNet, uint256 feeGrowthOutside0X128, uint256 feeGrowthOutside1X128, int56 tickCumulativeOutside, uint160 secondsPerLiquidityOutsideX128, uint32 secondsOutside, bool initialized)
```

Look up information about a specific tick in the pool

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tick | int24 | The tick to look up |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| liquidityGross | uint128 | the total amount of position liquidity that uses the pool either as tick lower or tick upper, liquidityNet how much liquidity changes when the pool price crosses the tick, feeGrowthOutside0X128 the fee growth on the other side of the tick from the current tick in token0, feeGrowthOutside1X128 the fee growth on the other side of the tick from the current tick in token1, tickCumulativeOutside the cumulative tick value on the other side of the tick from the current tick secondsPerLiquidityOutsideX128 the seconds spent per liquidity on the other side of the tick from the current tick, secondsOutside the seconds spent on the other side of the tick from the current tick, initialized Set to true if the tick is initialized, i.e. liquidityGross is greater than 0, otherwise equal to false. Outside values can only be used if the tick is initialized, i.e. if liquidityGross is greater than 0. In addition, these values are only relative and must be used only in comparison to previous snapshots for a specific position. |
| liquidityNet | int128 |  |
| feeGrowthOutside0X128 | uint256 |  |
| feeGrowthOutside1X128 | uint256 |  |
| tickCumulativeOutside | int56 |  |
| secondsPerLiquidityOutsideX128 | uint160 |  |
| secondsOutside | uint32 |  |
| initialized | bool |  |

### tickBitmap

```solidity
function tickBitmap(int16 wordPosition) external view returns (uint256)
```

Returns 256 packed tick initialized boolean values. See TickBitmap for more information

### positions

```solidity
function positions(bytes32 key) external view returns (uint128 _liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)
```

Returns the information about a position by the position's key

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| key | bytes32 | The position's key is a hash of a preimage composed by the owner, tickLower and tickUpper |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| _liquidity | uint128 | The amount of liquidity in the position, Returns feeGrowthInside0LastX128 fee growth of token0 inside the tick range as of the last mint/burn/poke, Returns feeGrowthInside1LastX128 fee growth of token1 inside the tick range as of the last mint/burn/poke, Returns tokensOwed0 the computed amount of token0 owed to the position as of the last mint/burn/poke, Returns tokensOwed1 the computed amount of token1 owed to the position as of the last mint/burn/poke |
| feeGrowthInside0LastX128 | uint256 |  |
| feeGrowthInside1LastX128 | uint256 |  |
| tokensOwed0 | uint128 |  |
| tokensOwed1 | uint128 |  |

### observations

```solidity
function observations(uint256 index) external view returns (uint32 blockTimestamp, int56 tickCumulative, uint160 secondsPerLiquidityCumulativeX128, bool initialized)
```

Returns data about a specific observation index

_You most likely want to use #observe() instead of this method to get an observation as of some amount of time
ago, rather than at a specific index in the array._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| index | uint256 | The element of the observations array to fetch |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| blockTimestamp | uint32 | The timestamp of the observation, Returns tickCumulative the tick multiplied by seconds elapsed for the life of the pool as of the observation timestamp, Returns secondsPerLiquidityCumulativeX128 the seconds per in range liquidity for the life of the pool as of the observation timestamp, Returns initialized whether the observation has been initialized and the values are safe to use |
| tickCumulative | int56 |  |
| secondsPerLiquidityCumulativeX128 | uint160 |  |
| initialized | bool |  |

## BitMath

_This library provides functionality for computing bit properties of an unsigned integer_

### Contract
BitMath : contracts/contracts/libraries/BitMath.sol

This library provides functionality for computing bit properties of an unsigned integer

 --- 
### Functions:
### mostSignificantBit

```solidity
function mostSignificantBit(uint256 x) internal pure returns (uint8 r)
```

Returns the index of the most significant bit of the number,
    where the least significant bit is at index 0 and the most significant bit is at index 255

_The function satisfies the property:
    x >= 2**mostSignificantBit(x) and x < 2**(mostSignificantBit(x)+1)_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| x | uint256 | the value for which to compute the most significant bit, must be greater than 0 |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| r | uint8 | the index of the most significant bit |

### leastSignificantBit

```solidity
function leastSignificantBit(uint256 x) internal pure returns (uint8 r)
```

Returns the index of the least significant bit of the number,
    where the least significant bit is at index 0 and the most significant bit is at index 255

_The function satisfies the property:
    (x & 2**leastSignificantBit(x)) != 0 and (x & (2**(leastSignificantBit(x)) - 1)) == 0)_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| x | uint256 | the value for which to compute the least significant bit, must be greater than 0 |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| r | uint8 | the index of the least significant bit |

## FixedPoint128

A library for handling binary fixed point numbers, see https://en.wikipedia.org/wiki/Q_(number_format)

### Contract
FixedPoint128 : contracts/contracts/libraries/FixedPoint128.sol

## FixedPoint96

A library for handling binary fixed point numbers, see https://en.wikipedia.org/wiki/Q_(number_format)

_Used in SqrtPriceMath.sol_

### Contract
FixedPoint96 : contracts/contracts/libraries/FixedPoint96.sol

Used in SqrtPriceMath.sol

## FullMath

Facilitates multiplication and division that can have overflow of an intermediate value without any loss of precision

_Handles "phantom overflow" i.e., allows multiplication and division where an intermediate value overflows 256 bits_

### Contract
FullMath : contracts/contracts/libraries/FullMath.sol

Handles "phantom overflow" i.e., allows multiplication and division where an intermediate value overflows 256 bits

 --- 
### Functions:
### mulDiv

```solidity
function mulDiv(uint256 a, uint256 b, uint256 denominator) internal pure returns (uint256 result)
```

Calculates floor(a×b÷denominator) with full precision. Throws if result overflows a uint256 or denominator == 0

_Credit to Remco Bloemen under MIT license https://xn--2-umb.com/21/muldiv_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| a | uint256 | The multiplicand |
| b | uint256 | The multiplier |
| denominator | uint256 | The divisor |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| result | uint256 | The 256-bit result |

### mulDivRoundingUp

```solidity
function mulDivRoundingUp(uint256 a, uint256 b, uint256 denominator) internal pure returns (uint256 result)
```

Calculates ceil(a×b÷denominator) with full precision. Throws if result overflows a uint256 or denominator == 0

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| a | uint256 | The multiplicand |
| b | uint256 | The multiplier |
| denominator | uint256 | The divisor |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| result | uint256 | The 256-bit result |

## LiquidityMath

### Contract
LiquidityMath : contracts/contracts/libraries/LiquidityMath.sol

 --- 
### Functions:
### addDelta

```solidity
function addDelta(uint128 x, int128 y) internal pure returns (uint128 z)
```

Add a signed liquidity delta to liquidity and revert if it overflows or underflows

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| x | uint128 | The liquidity before change |
| y | int128 | The delta by which liquidity should be changed |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| z | uint128 | The liquidity delta |

## LowGasSafeMath

Contains methods for doing math operations that revert on overflow or underflow for minimal gas cost

### Contract
LowGasSafeMath : contracts/contracts/libraries/LowGasSafeMath.sol

 --- 
### Functions:
### add

```solidity
function add(uint256 x, uint256 y) internal pure returns (uint256 z)
```

Returns x + y, reverts if sum overflows uint256

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| x | uint256 | The augend |
| y | uint256 | The addend |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| z | uint256 | The sum of x and y |

### sub

```solidity
function sub(uint256 x, uint256 y) internal pure returns (uint256 z)
```

Returns x - y, reverts if underflows

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| x | uint256 | The minuend |
| y | uint256 | The subtrahend |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| z | uint256 | The difference of x and y |

### mul

```solidity
function mul(uint256 x, uint256 y) internal pure returns (uint256 z)
```

Returns x * y, reverts if overflows

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| x | uint256 | The multiplicand |
| y | uint256 | The multiplier |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| z | uint256 | The product of x and y |

### add

```solidity
function add(int256 x, int256 y) internal pure returns (int256 z)
```

Returns x + y, reverts if overflows or underflows

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| x | int256 | The augend |
| y | int256 | The addend |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| z | int256 | The sum of x and y |

### sub

```solidity
function sub(int256 x, int256 y) internal pure returns (int256 z)
```

Returns x - y, reverts if overflows or underflows

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| x | int256 | The minuend |
| y | int256 | The subtrahend |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| z | int256 | The difference of x and y |

## Oracle

Provides price and liquidity data useful for a wide variety of system designs

_Instances of stored oracle data, "observations", are collected in the oracle array
Every pool is initialized with an oracle array length of 1. Anyone can pay the SSTOREs to increase the
maximum length of the oracle array. New slots will be added when the array is fully populated.
Observations are overwritten when the full length of the oracle array is populated.
The most recent observation is available, independent of the length of the oracle array, by passing 0 to observe()_

### Contract
Oracle : contracts/contracts/libraries/Oracle.sol

Instances of stored oracle data, "observations", are collected in the oracle array
Every pool is initialized with an oracle array length of 1. Anyone can pay the SSTOREs to increase the
maximum length of the oracle array. New slots will be added when the array is fully populated.
Observations are overwritten when the full length of the oracle array is populated.
The most recent observation is available, independent of the length of the oracle array, by passing 0 to observe()

 --- 
### Functions:
### initialize

```solidity
function initialize(struct Oracle.Observation[65535] self, uint32 time) internal returns (uint16 cardinality, uint16 cardinalityNext)
```

Initialize the oracle array by writing the first slot. Called once for the lifecycle of the observations array

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| self | struct Oracle.Observation[65535] | The stored oracle array |
| time | uint32 | The time of the oracle initialization, via block.timestamp truncated to uint32 |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| cardinality | uint16 | The number of populated elements in the oracle array |
| cardinalityNext | uint16 | The new length of the oracle array, independent of population |

### write

```solidity
function write(struct Oracle.Observation[65535] self, uint16 index, uint32 blockTimestamp, int24 tick, uint128 liquidity, uint16 cardinality, uint16 cardinalityNext) internal returns (uint16 indexUpdated, uint16 cardinalityUpdated)
```

Writes an oracle observation to the array

_Writable at most once per block. Index represents the most recently written element. cardinality and index must be tracked externally.
If the index is at the end of the allowable array length (according to cardinality), and the next cardinality
is greater than the current one, cardinality may be increased. This restriction is created to preserve ordering._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| self | struct Oracle.Observation[65535] | The stored oracle array |
| index | uint16 | The index of the observation that was most recently written to the observations array |
| blockTimestamp | uint32 | The timestamp of the new observation |
| tick | int24 | The active tick at the time of the new observation |
| liquidity | uint128 | The total in-range liquidity at the time of the new observation |
| cardinality | uint16 | The number of populated elements in the oracle array |
| cardinalityNext | uint16 | The new length of the oracle array, independent of population |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| indexUpdated | uint16 | The new index of the most recently written element in the oracle array |
| cardinalityUpdated | uint16 | The new cardinality of the oracle array |

### grow

```solidity
function grow(struct Oracle.Observation[65535] self, uint16 current, uint16 next) internal returns (uint16)
```

Prepares the oracle array to store up to `next` observations

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| self | struct Oracle.Observation[65535] | The stored oracle array |
| current | uint16 | The current next cardinality of the oracle array |
| next | uint16 | The proposed next cardinality which will be populated in the oracle array |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint16 | next The next cardinality which will be populated in the oracle array |

### observeSingle

```solidity
function observeSingle(struct Oracle.Observation[65535] self, uint32 time, uint32 secondsAgo, int24 tick, uint16 index, uint128 liquidity, uint16 cardinality) internal view returns (int56 tickCumulative, uint160 secondsPerLiquidityCumulativeX128)
```

_Reverts if an observation at or before the desired observation timestamp does not exist.
0 may be passed as `secondsAgo' to return the current cumulative values.
If called with a timestamp falling between two observations, returns the counterfactual accumulator values
at exactly the timestamp between the two observations._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| self | struct Oracle.Observation[65535] | The stored oracle array |
| time | uint32 | The current block timestamp |
| secondsAgo | uint32 | The amount of time to look back, in seconds, at which point to return an observation |
| tick | int24 | The current tick |
| index | uint16 | The index of the observation that was most recently written to the observations array |
| liquidity | uint128 | The current in-range pool liquidity |
| cardinality | uint16 | The number of populated elements in the oracle array |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| tickCumulative | int56 | The tick * time elapsed since the pool was first initialized, as of `secondsAgo` |
| secondsPerLiquidityCumulativeX128 | uint160 | The time elapsed / max(1, liquidity) since the pool was first initialized, as of `secondsAgo` |

### observe

```solidity
function observe(struct Oracle.Observation[65535] self, uint32 time, uint32[] secondsAgos, int24 tick, uint16 index, uint128 liquidity, uint16 cardinality) internal view returns (int56[] tickCumulatives, uint160[] secondsPerLiquidityCumulativeX128s)
```

Returns the accumulator values as of each time seconds ago from the given time in the array of `secondsAgos`

_Reverts if `secondsAgos` > oldest observation_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| self | struct Oracle.Observation[65535] | The stored oracle array |
| time | uint32 | The current block.timestamp |
| secondsAgos | uint32[] | Each amount of time to look back, in seconds, at which point to return an observation |
| tick | int24 | The current tick |
| index | uint16 | The index of the observation that was most recently written to the observations array |
| liquidity | uint128 | The current in-range pool liquidity |
| cardinality | uint16 | The number of populated elements in the oracle array |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| tickCumulatives | int56[] | The tick * time elapsed since the pool was first initialized, as of each `secondsAgo` |
| secondsPerLiquidityCumulativeX128s | uint160[] | The cumulative seconds / max(1, liquidity) since the pool was first initialized, as of each `secondsAgo` |

## Position

Positions represent an owner address' liquidity between a lower and upper tick boundary

_Positions store additional state for tracking fees owed to the position_

### Contract
Position : contracts/contracts/libraries/Position.sol

Positions store additional state for tracking fees owed to the position

 --- 
### Functions:
### get

```solidity
function get(mapping(bytes32 => struct Position.Info) self, address owner, int24 tickLower, int24 tickUpper) internal view returns (struct Position.Info position)
```

Returns the Info struct of a position, given an owner and position boundaries

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| self | mapping(bytes32 &#x3D;&gt; struct Position.Info) | The mapping containing all user positions |
| owner | address | The address of the position owner |
| tickLower | int24 | The lower tick boundary of the position |
| tickUpper | int24 | The upper tick boundary of the position |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | struct Position.Info | The position info struct of the given owners' position |

### update

```solidity
function update(struct Position.Info self, int128 liquidityDelta, uint256 feeGrowthInside0X128, uint256 feeGrowthInside1X128) internal
```

Credits accumulated fees to a user's position

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| self | struct Position.Info | The individual position to update |
| liquidityDelta | int128 | The change in pool liquidity as a result of the position update |
| feeGrowthInside0X128 | uint256 | The all-time fee growth in token0, per unit of liquidity, inside the position's tick boundaries |
| feeGrowthInside1X128 | uint256 | The all-time fee growth in token1, per unit of liquidity, inside the position's tick boundaries |

## SafeCast

Contains methods for safely casting between types

### Contract
SafeCast : contracts/contracts/libraries/SafeCast.sol

 --- 
### Functions:
### toUint160

```solidity
function toUint160(uint256 y) internal pure returns (uint160 z)
```

Cast a uint256 to a uint160, revert on overflow

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| y | uint256 | The uint256 to be downcasted |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| z | uint160 | The downcasted integer, now type uint160 |

### toInt128

```solidity
function toInt128(int256 y) internal pure returns (int128 z)
```

Cast a int256 to a int128, revert on overflow or underflow

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| y | int256 | The int256 to be downcasted |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| z | int128 | The downcasted integer, now type int128 |

### toInt256

```solidity
function toInt256(uint256 y) internal pure returns (int256 z)
```

Cast a uint256 to a int256, revert on overflow

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| y | uint256 | The uint256 to be casted |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| z | int256 | The casted integer, now type int256 |

## SqrtPriceMath

Contains the math that uses square root of price as a Q64.96 and liquidity to compute deltas

### Contract
SqrtPriceMath : contracts/contracts/libraries/SqrtPriceMath.sol

 --- 
### Functions:
### getNextSqrtPriceFromAmount0RoundingUp

```solidity
function getNextSqrtPriceFromAmount0RoundingUp(uint160 sqrtPX96, uint128 liquidity, uint256 amount, bool add) internal pure returns (uint160)
```

Gets the next sqrt price given a delta of token0

_Always rounds up, because in the exact output case (increasing price) we need to move the price at least
far enough to get the desired output amount, and in the exact input case (decreasing price) we need to move the
price less in order to not send too much output.
The most precise formula for this is liquidity * sqrtPX96 / (liquidity +- amount * sqrtPX96),
if this is impossible because of overflow, we calculate liquidity / (liquidity / sqrtPX96 +- amount)._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sqrtPX96 | uint160 | The starting price, i.e. before accounting for the token0 delta |
| liquidity | uint128 | The amount of usable liquidity |
| amount | uint256 | How much of token0 to add or remove from virtual reserves |
| add | bool | Whether to add or remove the amount of token0 |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint160 | The price after adding or removing amount, depending on add |

### getNextSqrtPriceFromAmount1RoundingDown

```solidity
function getNextSqrtPriceFromAmount1RoundingDown(uint160 sqrtPX96, uint128 liquidity, uint256 amount, bool add) internal pure returns (uint160)
```

Gets the next sqrt price given a delta of token1

_Always rounds down, because in the exact output case (decreasing price) we need to move the price at least
far enough to get the desired output amount, and in the exact input case (increasing price) we need to move the
price less in order to not send too much output.
The formula we compute is within <1 wei of the lossless version: sqrtPX96 +- amount / liquidity_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sqrtPX96 | uint160 | The starting price, i.e., before accounting for the token1 delta |
| liquidity | uint128 | The amount of usable liquidity |
| amount | uint256 | How much of token1 to add, or remove, from virtual reserves |
| add | bool | Whether to add, or remove, the amount of token1 |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint160 | The price after adding or removing `amount` |

### getNextSqrtPriceFromInput

```solidity
function getNextSqrtPriceFromInput(uint160 sqrtPX96, uint128 liquidity, uint256 amountIn, bool zeroForOne) internal pure returns (uint160 sqrtQX96)
```

Gets the next sqrt price given an input amount of token0 or token1

_Throws if price or liquidity are 0, or if the next price is out of bounds_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sqrtPX96 | uint160 | The starting price, i.e., before accounting for the input amount |
| liquidity | uint128 | The amount of usable liquidity |
| amountIn | uint256 | How much of token0, or token1, is being swapped in |
| zeroForOne | bool | Whether the amount in is token0 or token1 |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| sqrtQX96 | uint160 | The price after adding the input amount to token0 or token1 |

### getNextSqrtPriceFromOutput

```solidity
function getNextSqrtPriceFromOutput(uint160 sqrtPX96, uint128 liquidity, uint256 amountOut, bool zeroForOne) internal pure returns (uint160 sqrtQX96)
```

Gets the next sqrt price given an output amount of token0 or token1

_Throws if price or liquidity are 0 or the next price is out of bounds_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sqrtPX96 | uint160 | The starting price before accounting for the output amount |
| liquidity | uint128 | The amount of usable liquidity |
| amountOut | uint256 | How much of token0, or token1, is being swapped out |
| zeroForOne | bool | Whether the amount out is token0 or token1 |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| sqrtQX96 | uint160 | The price after removing the output amount of token0 or token1 |

### getAmount0Delta

```solidity
function getAmount0Delta(uint160 sqrtRatioAX96, uint160 sqrtRatioBX96, uint128 liquidity, bool roundUp) internal pure returns (uint256 amount0)
```

Gets the amount0 delta between two prices

_Calculates liquidity / sqrt(lower) - liquidity / sqrt(upper),
i.e. liquidity * (sqrt(upper) - sqrt(lower)) / (sqrt(upper) * sqrt(lower))_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sqrtRatioAX96 | uint160 | A sqrt price |
| sqrtRatioBX96 | uint160 | Another sqrt price |
| liquidity | uint128 | The amount of usable liquidity |
| roundUp | bool | Whether to round the amount up or down |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount0 | uint256 | Amount of token0 required to cover a position of size liquidity between the two passed prices |

### getAmount1Delta

```solidity
function getAmount1Delta(uint160 sqrtRatioAX96, uint160 sqrtRatioBX96, uint128 liquidity, bool roundUp) internal pure returns (uint256 amount1)
```

Gets the amount1 delta between two prices

_Calculates liquidity * (sqrt(upper) - sqrt(lower))_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sqrtRatioAX96 | uint160 | A sqrt price |
| sqrtRatioBX96 | uint160 | Another sqrt price |
| liquidity | uint128 | The amount of usable liquidity |
| roundUp | bool | Whether to round the amount up, or down |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount1 | uint256 | Amount of token1 required to cover a position of size liquidity between the two passed prices |

### getAmount0Delta

```solidity
function getAmount0Delta(uint160 sqrtRatioAX96, uint160 sqrtRatioBX96, int128 liquidity) internal pure returns (int256 amount0)
```

Helper that gets signed token0 delta

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sqrtRatioAX96 | uint160 | A sqrt price |
| sqrtRatioBX96 | uint160 | Another sqrt price |
| liquidity | int128 | The change in liquidity for which to compute the amount0 delta |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount0 | int256 | Amount of token0 corresponding to the passed liquidityDelta between the two prices |

### getAmount1Delta

```solidity
function getAmount1Delta(uint160 sqrtRatioAX96, uint160 sqrtRatioBX96, int128 liquidity) internal pure returns (int256 amount1)
```

Helper that gets signed token1 delta

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sqrtRatioAX96 | uint160 | A sqrt price |
| sqrtRatioBX96 | uint160 | Another sqrt price |
| liquidity | int128 | The change in liquidity for which to compute the amount1 delta |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount1 | int256 | Amount of token1 corresponding to the passed liquidityDelta between the two prices |

## SwapMath

Contains methods for computing the result of a swap within a single tick price range, i.e., a single tick.

### Contract
SwapMath : contracts/contracts/libraries/SwapMath.sol

 --- 
### Functions:
### computeSwapStep

```solidity
function computeSwapStep(uint160 sqrtRatioCurrentX96, uint160 sqrtRatioTargetX96, uint128 liquidity, int256 amountRemaining, uint24 feePips) internal pure returns (uint160 sqrtRatioNextX96, uint256 amountIn, uint256 amountOut, uint256 feeAmount)
```

Computes the result of swapping some amount in, or amount out, given the parameters of the swap

_The fee, plus the amount in, will never exceed the amount remaining if the swap's `amountSpecified` is positive_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sqrtRatioCurrentX96 | uint160 | The current sqrt price of the pool |
| sqrtRatioTargetX96 | uint160 | The price that cannot be exceeded, from which the direction of the swap is inferred |
| liquidity | uint128 | The usable liquidity |
| amountRemaining | int256 | How much input or output amount is remaining to be swapped in/out |
| feePips | uint24 | The fee taken from the input amount, expressed in hundredths of a bip |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| sqrtRatioNextX96 | uint160 | The price after swapping the amount in/out, not to exceed the price target |
| amountIn | uint256 | The amount to be swapped in, of either token0 or token1, based on the direction of the swap |
| amountOut | uint256 | The amount to be received, of either token0 or token1, based on the direction of the swap |
| feeAmount | uint256 | The amount of input that will be taken as a fee |

## Tick

Contains functions for managing tick processes and relevant calculations

### Contract
Tick : contracts/contracts/libraries/Tick.sol

 --- 
### Functions:
### tickSpacingToMaxLiquidityPerTick

```solidity
function tickSpacingToMaxLiquidityPerTick(int24 tickSpacing) internal pure returns (uint128)
```

Derives max liquidity per tick from given tick spacing

_Executed within the pool constructor_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tickSpacing | int24 | The amount of required tick separation, realized in multiples of `tickSpacing`     e.g., a tickSpacing of 3 requires ticks to be initialized every 3rd tick i.e., ..., -6, -3, 0, 3, 6, ... |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint128 | The max liquidity per tick |

### getFeeGrowthInside

```solidity
function getFeeGrowthInside(mapping(int24 => struct Tick.Info) self, int24 tickLower, int24 tickUpper, int24 tickCurrent, uint256 feeGrowthGlobal0X128, uint256 feeGrowthGlobal1X128) internal view returns (uint256 feeGrowthInside0X128, uint256 feeGrowthInside1X128)
```

Retrieves fee growth data

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| self | mapping(int24 &#x3D;&gt; struct Tick.Info) | The mapping containing all tick information for initialized ticks |
| tickLower | int24 | The lower tick boundary of the position |
| tickUpper | int24 | The upper tick boundary of the position |
| tickCurrent | int24 | The current tick |
| feeGrowthGlobal0X128 | uint256 | The all-time global fee growth, per unit of liquidity, in token0 |
| feeGrowthGlobal1X128 | uint256 | The all-time global fee growth, per unit of liquidity, in token1 |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| feeGrowthInside0X128 | uint256 | The all-time fee growth in token0, per unit of liquidity, inside the position's tick boundaries |
| feeGrowthInside1X128 | uint256 | The all-time fee growth in token1, per unit of liquidity, inside the position's tick boundaries |

### update

```solidity
function update(mapping(int24 => struct Tick.Info) self, int24 tick, int24 tickCurrent, int128 liquidityDelta, uint256 feeGrowthGlobal0X128, uint256 feeGrowthGlobal1X128, uint160 secondsPerLiquidityCumulativeX128, int56 tickCumulative, uint32 time, bool upper, uint128 maxLiquidity) internal returns (bool flipped)
```

Updates a tick and returns true if the tick was flipped from initialized to uninitialized, or vice versa

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| self | mapping(int24 &#x3D;&gt; struct Tick.Info) | The mapping containing all tick information for initialized ticks |
| tick | int24 | The tick that will be updated |
| tickCurrent | int24 | The current tick |
| liquidityDelta | int128 | A new amount of liquidity to be added (subtracted) when tick is crossed from left to right (right to left) |
| feeGrowthGlobal0X128 | uint256 | The all-time global fee growth, per unit of liquidity, in token0 |
| feeGrowthGlobal1X128 | uint256 | The all-time global fee growth, per unit of liquidity, in token1 |
| secondsPerLiquidityCumulativeX128 | uint160 | The all-time seconds per max(1, liquidity) of the pool |
| tickCumulative | int56 | The tick * time elapsed since the pool was first initialized |
| time | uint32 | The current block timestamp cast to a uint32 |
| upper | bool | true for updating a position's upper tick, or false for updating a position's lower tick |
| maxLiquidity | uint128 | The maximum liquidity allocation for a single tick |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| flipped | bool | Whether the tick was flipped from initialized to uninitialized, or vice versa |

### clear

```solidity
function clear(mapping(int24 => struct Tick.Info) self, int24 tick) internal
```

Clears tick data

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| self | mapping(int24 &#x3D;&gt; struct Tick.Info) | The mapping containing all initialized tick information for initialized ticks |
| tick | int24 | The tick that will be cleared |

### cross

```solidity
function cross(mapping(int24 => struct Tick.Info) self, int24 tick, uint256 feeGrowthGlobal0X128, uint256 feeGrowthGlobal1X128, uint160 secondsPerLiquidityCumulativeX128, int56 tickCumulative, uint32 time) internal returns (int128 liquidityNet)
```

Transitions to next tick as needed by price movement

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| self | mapping(int24 &#x3D;&gt; struct Tick.Info) | The mapping containing all tick information for initialized ticks |
| tick | int24 | The destination tick of the transition |
| feeGrowthGlobal0X128 | uint256 | The all-time global fee growth, per unit of liquidity, in token0 |
| feeGrowthGlobal1X128 | uint256 | The all-time global fee growth, per unit of liquidity, in token1 |
| secondsPerLiquidityCumulativeX128 | uint160 | The current seconds per liquidity |
| tickCumulative | int56 | The tick * time elapsed since the pool was first initialized |
| time | uint32 | The current block.timestamp |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| liquidityNet | int128 | The amount of liquidity added (subtracted) when tick is crossed from left to right (right to left) |

## TickBitmap

Stores a packed mapping of tick index to its initialized state

_The mapping uses int16 for keys since ticks are represented as int24 and there are 256 (2^8) values per word._

### Contract
TickBitmap : contracts/contracts/libraries/TickBitmap.sol

The mapping uses int16 for keys since ticks are represented as int24 and there are 256 (2^8) values per word.

 --- 
### Functions:
### flipTick

```solidity
function flipTick(mapping(int16 => uint256) self, int24 tick, int24 tickSpacing) internal
```

Flips the initialized state for a given tick from false to true, or vice versa

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| self | mapping(int16 &#x3D;&gt; uint256) | The mapping in which to flip the tick |
| tick | int24 | The tick to flip |
| tickSpacing | int24 | The spacing between usable ticks |

### nextInitializedTickWithinOneWord

```solidity
function nextInitializedTickWithinOneWord(mapping(int16 => uint256) self, int24 tick, int24 tickSpacing, bool lte) internal view returns (int24 next, bool initialized)
```

Returns the next initialized tick contained in the same word (or adjacent word) as the tick that is either
to the left (less than or equal to) or right (greater than) of the given tick

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| self | mapping(int16 &#x3D;&gt; uint256) | The mapping in which to compute the next initialized tick |
| tick | int24 | The starting tick |
| tickSpacing | int24 | The spacing between usable ticks |
| lte | bool | Whether to search for the next initialized tick to the left (less than or equal to the starting tick) |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| next | int24 | The next initialized or uninitialized tick up to 256 ticks away from the current tick |
| initialized | bool | Whether the next tick is initialized, as the function only searches within up to 256 ticks |

## TickMath

Computes sqrt price for ticks of size 1.0001, i.e. sqrt(1.0001^tick) as fixed point Q64.96 numbers. Supports
prices between 2**-128 and 2**128

### Contract
TickMath : contracts/contracts/libraries/TickMath.sol

 --- 
### Functions:
### getSqrtRatioAtTick

```solidity
function getSqrtRatioAtTick(int24 tick) internal pure returns (uint160 sqrtPriceX96)
```

Calculates sqrt(1.0001^tick) * 2^96

_Throws if |tick| > max tick_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tick | int24 | The input tick for the above formula |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| sqrtPriceX96 | uint160 | A Fixed point Q64.96 number representing the sqrt of the ratio of the two assets (token1/token0) at the given tick |

### getTickAtSqrtRatio

```solidity
function getTickAtSqrtRatio(uint160 sqrtPriceX96) internal pure returns (int24 tick)
```

Calculates the greatest tick value such that getRatioAtTick(tick) <= ratio

_Throws in case sqrtPriceX96 < MIN_SQRT_RATIO, as MIN_SQRT_RATIO is the lowest value getRatioAtTick may
ever return._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sqrtPriceX96 | uint160 | The sqrt ratio for which to compute the tick as a Q64.96 |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| tick | int24 | The greatest tick for which the ratio is less than or equal to the input ratio |

## TransferHelper

Contains helper methods for interacting with ERC20 tokens that do not consistently return true/false

### Contract
TransferHelper : contracts/contracts/libraries/TransferHelper.sol

 --- 
### Functions:
### safeTransfer

```solidity
function safeTransfer(address token, address to, uint256 value) internal
```

Transfers tokens from msg.sender to a recipient

_Calls transfer on token contract, errors with TF if transfer fails_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | address | The contract address of the token which will be transferred |
| to | address | The recipient of the transfer |
| value | uint256 | The value of the transfer |

## UnsafeMath

Contains methods that perform common math functions but do not do any overflow or underflow checks

### Contract
UnsafeMath : contracts/contracts/libraries/UnsafeMath.sol

 --- 
### Functions:
### divRoundingUp

```solidity
function divRoundingUp(uint256 x, uint256 y) internal pure returns (uint256 z)
```

Returns ceil(x / y)

_division by 0 has unspecified behavior, and must be checked externally_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| x | uint256 | The dividend |
| y | uint256 | The divisor |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| z | uint256 | The quotient, ceil(x / y) |

